package com.simple.bs.result;

public class Result {
  //响应码
  private int code;

  public Result(int code) {
    this.code = code;
  }

  public Result(int resultCode, String message, Object data) {
  }

  public int getCode() {
    return code;
  }

  public void setCode(int code) {
    this.code = code;
  }
}
