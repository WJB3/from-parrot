const NOOP = require("@parrotjs/noop");
const merge = require("@parrotjs/merge-descriptor");

let ID = 0;

export const RecordOpenFailCodeMap = new Map([
  [1, "录音行为已被打开"],
  [2, "浏览器不支持录音行为"],
  [3, "其他原因"],
]);

export const RecordOpenSuccessCodeMap = new Map([[1, "录音行为打开成功"]]);

interface RecorderStreamIF {
  getTracks?: Function;
  audioTracks?: Object;
  _m?: Object;
  _p?: Object;
  _call?: Object;
}

interface IAudioCtx {
  state?: string;
  createMediaStreamSource?: Function;
  createScriptProcessor?: Function;
  createJavaScriptNode?: Function;
  destination?: Object;
  resume?: Function;
  sampleRate?: number;
  close?: Function;
}
interface IRecordScope {
  getUserMedia?: Function;
  webkitGetUserMedia?: any;
  mozGetUserMedia?: any;
  msGetUserMedia?: any;
}

interface IPrevChunkInfo{
  index?:number;
  offset?:number;
  frameNext?:Array<number>;
}
interface setObjectIF {
  type?: string;
  takeoffEncodeChunk?: Boolean;
  sampleRate?: number;
  //是否禁用设备卡顿时音频输入丢失补偿功能
  disableEnvInFix?: Boolean;
  onProcess?: Function;
}

interface lockSyncIF {
  OPEN?: number;
  CLOSE?: number;
}

interface odIF {
  o?: number;
  d?: number;
}

class fixObj {
  t?: number;
  d?: number;
}

class RecorderCore {
  id: number;
  RecordScope: IRecordScope;
  AudioCtx: IAudioCtx;
  DestroyList: Object;
  Stream: RecorderStreamIF;
  STATE: Number;
  set: setObjectIF;
  Sync: lockSyncIF;
  BufferSize: number;
  Buffers: Array<Int16Array>;
  RecSize: number;
  EnvInLast: number;
  EnvInFirst: number;
  EnvInFix: number;
  EnvInFixTs: Array<fixObj>;
  srcSampleRate: number;

  constructor(props) {
    this.RecordScope = null;
    this.AudioCtx = null;
    this.DestroyList = {};
    this.Stream = {};
    this.STATE = 1;
    this.init(props);
    this.set = {};
    this.Sync = {
      OPEN: 9,
      CLOSE: 9,
    };
    //数据缓存
    this.Buffers = [];
    //数据大小
    this.RecSize = 0;
    //envIn接收到最后录音内容的时间
    this.EnvInLast = 0;
    //envIn接收到的首个录音内容的录制时间
    this.EnvInFirst = 0;
    //补偿的总时间
    this.EnvInFix = 0;
    //补偿计数列表
    this.EnvInFixTs = [];
    /*H5录音时的AudioContext缓冲大小。会影响H5录音时的onProcess调用速率，相对于AudioContext.sampleRate=48000时，4096接近12帧/s，调节此参数可生成比较流畅的回调动画。
            取值256, 512, 1024, 2048, 4096, 8192, or 16384
            注意，取值不能过低，2048开始不同浏览器可能回调速率跟不上造成音质问题。
            一般无需调整，调整后需要先close掉已打开的录音，再open时才会生效。
        */
    this.BufferSize = 4096;
    this.srcSampleRate = 0;
  }

  init = (setProps) => {
    this.id = ++ID;

    let config = {
      type: "mp3",
      onProcess: NOOP,
      disableEnvInFix: false,
    };

    merge(this.set, config, setProps);
  };
  /**
   * 计算音量百分比的一个方法
   * @param pcmAbsSum pcm Int16所有采样的绝对值的和
   * @param pcmLength pcm 长度
   * @return 0-100 主要当作百分比用 注意不是分贝，因此当作百分比用
   */
  PowerLevel = (pcmAbsSum, pcmLength) => {
    /**
     * 计算音量 https://blog.csdn.net/jody1989/article/details/73480259
     * 更高灵敏度算法:
     *     限定最大感应值10000
     *          线性曲线：低音量不友好
     *              power/10000*100
     *          对数曲线：低音量友好，但需限定最低感应值
     *              (1+Math.log10(pow/10000))*100
     */
    let power = pcmAbsSum / pcmLength || 0;
    let level;
    //1250的结果10%，更小的音量采用线性取值
    if (power < 1251) {
      level = Math.round((power / 1250) * 10);
    } else {
      level = Math.round(
        Math.min(
          100,
          Math.max(0, (1 + Math.log(power / 10000) / Math.log(10)) * 100)
        )
      );
    }
    return level;
  };

  _stop = () => {
    const self = this;

    if (self.STATE) {
      self.pause();
      self.STATE = 0;
    }
  };

  /**
   * 带时间的打印方法
   * @param msg 打印信息
   * @param errCode 打印等级 1-log 2-warn 3-err
   */
  log = (msg, logLevel = 1) => {
    let now = new Date();
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");
    let milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    let logMessage = `${minutes}:${seconds}.${milliseconds}`;
    let arr = [`[${logMessage} Recorder] ${msg}`],
      fn = console.log;

    switch (logLevel) {
      case 1:
        fn = console.log;
        break;
      case 2:
        fn = console.warn;
        break;
      case 3:
        fn = console.error;
        break;
      default:
        fn = console.log;
        break;
    }

    fn.apply(console, arr);
  };
  /**
   * 是否已经打开了录音，所有工作都已经准备好了，就等接收音频数据了
   */
  isOpened = () => {
    let stream = this.Stream;
    if (stream) {
      let tracks =
        (stream.getTracks && stream.getTracks()) || stream.audioTracks || [];
      let track = tracks[0];
      if (track) {
        let state = track.readyState;
        return state === "live" || state === track.LIVE;
      }
    }
    return false;
  };

  /**
   * 返回一个浮点数表示采样率（每秒采样数）
   * @param sampleRate
   */
  envStart = (sampleRate) => {
    const self = this,
      set = self.set;
    self.Buffers = [];
    self.RecSize = 0;

    self.EnvInLast = 0;
    self.EnvInFirst = 0;
    self.EnvInFix = 0;
    self.EnvInFixTs = [];

    set.sampleRate = Math.min(sampleRate, set.sampleRate);
    self.srcSampleRate = sampleRate;
  };

  //打开录音资源
  open = () => {
    const self = this;
    return new Promise(function (resolve, reject) {
      /**
       * 如果录音行为已打开就不要再打开了
       */
      if (self.isOpened()) {
        reject(1);
      }
      /**
       * 浏览器是否支持录音
       */
      if (!self.support()) {
        reject(2);
      }

      let pro = self.RecordScope.getUserMedia({ audio: true });

      if (pro && pro.then) {
        pro
          .then((stream) => {
            self.openSuccess(stream);
            resolve(1);
          })
          .catch((e) => {
            self.openFail(e);
            reject(3);
          });
      }
    });
  };

  /**
   * 暂停录音
   */
  pause = () => {
    const self = this;
    if (self.STATE) {
      self.STATE = 2;
      self.log("pause the record");
      delete self.Stream._call[self.id];
    }
  };
  /**
   * 对pcm数据的采样率进行转换
   * pcmDatas:[[Int16,...]] pcm片段列表
   * pcmSampleRate:48000 pcm数据的采样率
   * newSampleRate:16000 需要转换成的采样率，newSampleRate>pcmSampleRate时不会进行任何处理，
   * 小于时会进行重新采样。
   * prevChunkInfo: {} 可选，上次调用时的返回值，用于连续转换，本次调用将从上次结束位置开始进行处理。或可自行定义一个ChunkInfo从pcmDatas指定的位置开始进行转换
   * option:{ 可选，配置项
   *    frameSize:123456 帧大小 每帧的PCM Int16的数量 采样率转换后的pcm长度为frameSize的整数倍，
   *      用于连续转换。目前仅在mp3格式时才有用，frameSize取值为1152，这样编码出来的mp3时长和pcm的
   *      时长完全一致，否则会因为mp3最后一帧录音不够填满时添加填充数据导致mp3的时长变长。
   *    frameType:""  帧类型，一般为rec.set.type，提供此参数时无需提供frameSize，会自动使用最佳的值给frameSize赋值，
   *      目前仅支持mp3=1152(MPEG1 Layer3的每帧采采样数)，其他类型=1。以上两个参数用于连续转换时使用，最多使用一个，不
   *      提供时不进行帧的特殊处理，提供时必须同时提供prevChunkInfo才有作用。最后一段数据处理时无需提供帧大小以便输出最后一丁点残留数据。
   * }
   *
   * 返回ChunkInfo:{
   *  //可定义，从指定位置开始转换到结尾
   *    index:0 pcmDatas已处理到的索引
   *    offset:0.0 已处理到的index对应的pcm的偏移的下一个位置
   *
   *  //仅作为返回值
   *    frameNext:null || [Int16,...] 下一帧的部分数据，frameSize设置了的时候才可能会有
   *    sampleRate:16000 结果的采样率 <=newSampleRate
   *    data:[Int16,...] 转换后的PCM结果：如果是连续转换，并且pcmDatas中并没有新数据时，data的长度可能为0
   * }
   */
  SampleData=(pcmDatas,pcmSampleRate,newSampleRate,prevChunkInfo:IPrevChunkInfo={},option={})=>{

    let index=prevChunkInfo.index || 0;
    let offset=prevChunkInfo.offset || 0;

    let frameNext=prevChunkInfo.frameNext || [];



  }
  /**
   * 恢复录音
   */
  resume = () => {
    const self = this;

    self.STATE = 1;

    self.log("恢复录音");

    //重新开始计数
    self.EnvInFixTs = [];

    self.Stream._call[self.id] = function (pcm, sum) {
      if (self.STATE === 1) {
        self.envIn(pcm, sum);
      }
    };
  };

  //和平台环境无关的pcm[Int16]输入
  envIn = (pcm, sum) => {
    let self = this,
      set = self.set;
    let bufferSampleRate = self.srcSampleRate;
    let size = pcm.length;
    let powerLevel = self.PowerLevel(sum, size);

    let buffers = self.Buffers;
    let bufferFirstIdx = buffers.length; //之前的buffer都是经过onProcess处理好的，不允许再修改
    buffers.push(pcm);

    //有engineCtx时会被覆盖，这里保存一份
    let buffersThis = buffers;

    //卡顿丢失补偿：因为设备很卡的时候导致H5接收到的数据量不够造成播放时候变速，结果比实际的时长要短，此处保证了不会变短，但不能修复丢失的音频数据造成音质变差。当前算法采用输入时间侦测下一帧是否需要添加补偿帧，需要(6次输入||超过1秒)以上才会开始侦测，如果滑动窗口内丢失超过1/3就会进行补偿
    let now = Date.now();
    let pcmTime = Math.round((size / bufferSampleRate) * 1000);
    self.EnvInLast = now;
    if (self.Buffers.length == 1) {
      //记下首个录音数据的录制时间
      self.EnvInFirst = now - pcmTime;
    }
    let envInFixTs = self.EnvInFixTs;
    envInFixTs.splice(0, 0, { t: now, d: pcmTime });
    //保留3秒的计数滑动窗口，另外超过3秒的停顿不补偿
    let tsInStart = now,
      tsPcm = 0;
    for (let i = 0; i < envInFixTs.length; i++) {
      let o = envInFixTs[i];
      if (now - o.t > 3000) {
        envInFixTs.length = i;
        break;
      }
      tsInStart = o.t;
      tsPcm += o.d;
    }
    //达到需要的数据量，开始侦测是否需要补偿
    let tsInPrev = envInFixTs[1];
    let tsIn = now - tsInStart;
    let lost = tsIn - tsPcm;
    if (
      lost > tsIn / 3 &&
      ((tsInPrev && tsIn > 1000) || envInFixTs.length >= 6)
    ) {
      //丢失过多，开始执行补偿
      let addTime = now - tsInPrev.t - pcmTime; //距离上次输入丢失这么多ms
      if (addTime > pcmTime / 5) {
        //丢失超过本帧的1/5
        let fixOpen = !set.disableEnvInFix;
        self.log(
          "[" + now + "]" + (fixOpen ? "" : "未") + "补偿" + addTime + "ms",
          3
        );
        self.EnvInFix += addTime;

        //用静默进行补偿
        if (fixOpen) {
          let addPcm = new Int16Array((addTime * bufferSampleRate) / 1000);
          size += addPcm.length;
          buffers.push(addPcm);
        }
      }
    }

    let sizeOld = self.RecSize,
      addSize = size;
    let bufferSize = sizeOld + addSize;
    self.RecSize = bufferSize; //此值在onProcess后需要修正，可能新数据被修改

    let duration = Math.round((bufferSize / bufferSampleRate) * 1000);
    let bufferNextIdx = buffers.length;

    //允许异步处理buffer数据
    let asyncEnd = function () {
      //重新计算size，异步的早已减去添加的，同步的需去掉本次添加的然后重新计算
      let num = asyncBegin ? 0 : -addSize;
      let hasClear: boolean | number = buffers[0] == null;
      for (let i = bufferFirstIdx; i < bufferNextIdx; i++) {
        let buffer = buffers[i];
        if (buffer == null) {
          //已被主动释放内存，比如长时间实时传输录音时
          hasClear = 1;
        } else {
          num += buffer.length;
        }
      }

      //统计修改后的size，如果异步发生clear要原样加回来，同步的无需操作
      if (hasClear) {
        num = asyncBegin ? addSize : 0;

        buffers[0] = null; //彻底被清理
      }
      self.RecSize += num;
    };
    //实时回调处理数据，允许修改或替换上次回调以来新增的数据 ，但是不允许修改已处理过的，不允许增删第一维数组 ，允许将第二维数组任意修改替换成空数组也可以
    let asyncBegin = set.onProcess(
      buffers,
      powerLevel,
      duration,
      bufferSampleRate,
      bufferFirstIdx,
      asyncEnd
    );

    if (asyncBegin === true) {
      //开启了异步模式，onProcess已接管buffers新数据，立即清空，避免出现未处理的数据
      let hasClear = 0;
      for (let i = bufferFirstIdx; i < bufferNextIdx; i++) {
        if (buffers[i] == null) {
          //已被主动释放内存，比如长时间实时传输录音时 ，但又要开启异步模式，此种情况是非法的
          hasClear = 1;
        } else {
          buffers[i] = new Int16Array(0);
        }
      }

      if (hasClear) {
        self.log("未进入异步前不能清除buffers", 3);
      } else {
        //还原size，异步结束后再统计仅修改后的size，如果发生clear要原样加回来
        self.RecSize -= addSize;
      }
    } else {
      asyncEnd();
    }
  };
  //播放录音
  start = () => {
    const self = this,
      set = self.set,
      ctx = self.AudioCtx;
    return new Promise((resolve, reject) => {
      //录音行为未打开无法开始录音
      if (!self.isOpened()) {
        reject(1);
      }
      self.log("开始录音...");
      self._stop();
      self.envStart(ctx.sampleRate);

      self.resume();
    });
  };
  //关闭录音
  close = () => {
    let self = this,
      set = self.set,
      t1;
    //标准UI线程转码，调整采样率
    t1 = Date.now();
  };
  /**
   * 初始化H5音频采集连接，因为Stream是全局的，Safari上断开后就无法再次进行连接使用，表现为静音，因此使用全部使用全局处理避免调用到disconnect；全局处理也有利于屏蔽底层细节，start时无需再调用底层接口，提升兼容、可靠性。
   */
  connect = () => {
    let self = this,
      stream = self.Stream,
      ctx = self.AudioCtx;
    let media = (stream._m = ctx.createMediaStreamSource(stream));
    //单声道，省的数据处理复杂
    let process = (stream._p = (
      ctx.createScriptProcessor || ctx.createJavaScriptNode
    ).call(ctx, self.BufferSize, 1, 1));

    media.connect(process);
    process.connect(ctx.destination);

    let calls = stream._call;
    process.onaudioprocess = function (e) {
      //has item
      let o = e.inputBuffer.getChannelData(0);
      let size = o.length;

      let pcm = new Int16Array(size);
      let sum = 0;

      //floatTo16BitPCM
      for (let j = 0; j < size; j++) {
        let s = Math.max(-1, Math.min(1, o[j]));
        s = s < 0 ? s * 0x8000 : s * 0x7fff;
        pcm[j] = s;
        sum += Math.abs(s);
      }

      for (let k in calls) {
        calls[k](pcm, sum);
      }

      return;
    };
  };
  //打开成功
  openSuccess = (stream) => {
    const self = this;
    self.Stream = stream;
    //此时is open，但并未connect，是允许绑定接收数据的
    stream._call = {};
    setTimeout(function () {
      self.connect();
    }, 100);
  };
  //打开失败
  openFail = (e) => {};
  //初始化AudioCtx
  initAudioCtx = () => {
    let AC = window.AudioContext || window.webkitAudioContext;

    if (AC) {
      this.AudioCtx = new AC();
    }
  };
  //初始化RecordScope
  initRecordScope = () => {
    let scope: IRecordScope = navigator.mediaDevices || {};
    if (!scope.getUserMedia) {
      scope = navigator;
      scope.getUserMedia =
        scope.webkitGetUserMedia ||
        scope.mozGetUserMedia ||
        scope.msGetUserMedia;
    }
    this.RecordScope = scope;
  };
  //初始化环境
  initEnvironment = () => {
    this.initAudioCtx();

    this.initRecordScope();
  };
  //是否支持AudioContext
  support = () => {
    const self = this;

    self.initEnvironment();

    if (self.AudioCtx) {
      self.bindDestroy("AudioCtx", function () {
        let ctx = self.AudioCtx;
        //关闭一个音频环境, 释放任何正在使用系统资源的音频
        ctx && ctx.close && ctx.close();
      });
    }
    return self.AudioCtx && self.RecordScope && self.RecordScope.getUserMedia;
  };
  //销毁全局资源的处理方法
  bindDestroy = (key, call) => {
    this.DestroyList[key] = call;
  };
}
