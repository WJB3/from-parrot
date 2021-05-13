import React, { useEffect, useRef, useState } from 'react';
import styles from './Welcome.less';
import { Drawer, Alert, Input, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
const { TextArea } = Input;
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Uploader from './components/Uploader';
import Form from './components/Form';

const componentStyle = {
  style: {
    fontSize: 20,
  },
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({});

export default (): React.ReactNode => {
  const [componentsData, setComponentsData] = useState([
    {
      name: '通知栏',
      icon: <MenuUnfoldOutlined {...componentStyle} />,
    },
    {
      name: '输入区域',
      icon: <MenuFoldOutlined {...componentStyle} />,
    },
    {
      name: '图片选择器',
      icon: <UploadOutlined {...componentStyle} />,
    },
  ]);

  const [editTemplateComponent, setEditTemplateComponent] = useState([
    {
      index: 0,
      component: 'alert',
      value: '',
      number: 1,
    },
    {
      index: 1,
      component: 'textarea',
      value: '',
    },
    {
      index: 2,
      component: 'uploader',
      value: '',
    },
  ]);

  const handleSubmit = () => {
    console.log('--handleSubmit--', editTemplateComponent);
    const data = editTemplateComponent.map((item, index) => ({
      step: index + 1,
      type: item.component === 'alert' ? 1 : item.component === 'textarea' ? 2 : 3,
      value: item.value,
    }));
    console.log('--data--', data);
    localStorage.setItem('DATA', JSON.stringify(data));
  };

  const findIndex = (componentName: any, active: any) => {
    return editTemplateComponent.findIndex(
      (item) => item.component === componentName && item.index === active,
    );
  };

  const activeRef=useRef(null);

  const [editVisible, setEditVisible] = useState(false);

  const [active, setActive] = useState(-1);

  const [component, setComponent] = useState('');

  const setCurrent = (item: any) => (e: any) => {
    console.log('item', item);
    setActive(item.index);
    setEditVisible(true);
    setComponent(item.component);
    e.stopPropagation();
  };

  const clickOther = (e: any) => {
    console.log('clickOther');
    setActive(-1);
    setEditVisible(false);
    setComponent('');
  };

  const handleValuesChange = (item: any) => {
    console.log('handleValuesChange', item);
    const { currentComponent, alertTitle, textareaValue, imgUrl, active } = item;
    const changeIndex = findIndex(currentComponent, active);
    if (currentComponent === 'alert') {
      editTemplateComponent.splice(changeIndex, 1, {
        ...editTemplateComponent[changeIndex],
        value: alertTitle,
      });
      setEditTemplateComponent([].concat(editTemplateComponent));
    } else if (currentComponent === 'textarea') {
      editTemplateComponent.splice(changeIndex, 1, {
        ...editTemplateComponent[changeIndex],
        value: textareaValue,
      });
      setEditTemplateComponent([].concat(editTemplateComponent));
    } else {
      editTemplateComponent.splice(changeIndex, 1, {
        ...editTemplateComponent[changeIndex],
        value: imgUrl,
      });
      setEditTemplateComponent([].concat(editTemplateComponent));
    }
  };

  useEffect(() => {
    const DAT: any = localStorage.getItem('DATA');
    const data = DAT
      ? JSON.parse(DAT)
      : [
          {
            step: 1,
            type: 1,
            value: '',
          },
          {
            step: 2,
            type: 2,
            value: '',
          },
          {
            step: 3,
            type: 3,
            value: '',
          },
        ];

    const filterData = data.map((item) => ({
      index: item.step - 1,
      value: item.value,
      component: item.type === 1 ? 'alert' : item.type === 2 ? 'textarea' : 'uploader',
    }));

    let first = 1;
    for (let i = 0; i < filterData.length; i++) {
      if (filterData[i].component === 'alert') {
        filterData[i].number = first++;
      }
    }
    console.log('---data---', filterData);
    setEditTemplateComponent(filterData);
  }, [localStorage.getItem('DATA')]);

  const onDragEnd = (result) => {
    const {
      source: { index: sourceIndex, droppableId: sourceId },
      destination: { index: destinationIndex, droppableId: destinationId },
    } = result; 
    if (sourceId !== destinationId) {
      editTemplateComponent.splice(destinationIndex, 0, {
        component: sourceIndex === 0 ? 'alert' : sourceIndex === 1 ? 'textarea' : 'uploader',
        value: '',
      } as any);
    } else {
      let rest = editTemplateComponent.splice(sourceIndex, 1)[0]; 
      editTemplateComponent.splice(destinationIndex, 0, rest);
    }

    let first = 1;
    for (let i = 0; i < editTemplateComponent.length; i++) {
      if (editTemplateComponent[i].component === 'alert') {
        editTemplateComponent[i].number = first++;
      }
    }

    setEditTemplateComponent(
      [].concat(editTemplateComponent.map((item, index) => ({ ...item, index }))),
    );
  }; 

  const currentItem = editTemplateComponent.find((item) => item.index === active) || {};

  const handleDelete=()=>{
    editTemplateComponent.splice(active,1)
    let first = 1;
    for (let i = 0; i < editTemplateComponent.length; i++) {
      if (editTemplateComponent[i].component === 'alert') {
        editTemplateComponent[i].number = first++;
      }
    }

    setEditTemplateComponent(
      [].concat(editTemplateComponent.map((item, index) => ({ ...item, index }))),
    );
    setActive(-1);
  }

  useEffect(()=>{ 
    let ref:any=document.getElementById('active');
    if(ref){
      const object=ref.getBoundingClientRect();
      
      console.log('-offsetTop-',ref.offsetTop)
      setTop(ref.offsetTop+30);
    }
    
  },[active])

  const [top,setTop]=useState(0);

  return (
    <div className={styles.containerPage}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              className={styles.componentsView}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {componentsData.map((item, index) => (
                <Draggable key={`${item.name}${index}`} draggableId={item.name} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={styles.item}
                      key={`${item.name}${index}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <div className={styles.icon}>{item.icon}</div>
                      <div className={styles.name}>{item.name}</div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
 
        <div className={styles.templatesView}>
          <div className={styles.editTemplate}>
            <div className={styles.delete} style={{top:top}} onClick={handleDelete}>{active !== -1 && <DeleteOutlined />}</div>

            <div className={styles.contentWrapper}>
              <div className={styles.header}>
                <div className={styles.img}></div>
              </div>
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    className={`${styles.container}`}
                    onClick={clickOther}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {editTemplateComponent.map((item, index) => {
                      return (
                        <Draggable key={item.index} draggableId={`${item.index}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                              )}
                              id={active===index?'active':''}
                              onClick={setCurrent(item)}
                              className={`${styles.item} 
                
                        ${item.component === 'textarea' ? styles.inputTextarea : ''}
                        ${item.component === 'alert' ? styles.alert : ''}
                        ${item.component === 'uploader' ? styles.uploader : ''}`}
                              key={item.component}
                            >
                              {item.component === 'alert' && (
                                <Alert
                                  message={
                                    <>
                                      <div className={`${styles.icon}`}>{item.number}</div>
                                      <div className={styles.split}></div>
                                      {item.value && (
                                        <div className={`${styles.message}`}>{item.value}</div>
                                      )}
                                    </>
                                  }
                                  type="info"
                                  banner
                                  showIcon={false}
                                />
                              )}
                              {item.component === 'textarea' && (
                                <TextArea
                                  placeholder="请输入，可换行"
                                  autoSize
                                  value={item.value}
                                  disabled
                                />
                              )}
                              {item.component === 'uploader' && <Uploader value={item.value} />}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div className={`${styles.editTemplate} ${styles.viewTemplate}`}>
            <div className={styles.contentWrapper}>
              <div className={styles.header}>
                <div className={styles.img}></div>
              </div>
              <div className={`${styles.container}`}>
                {editTemplateComponent.map((item, index) => {
                  return (
                    <div
                      className={`${styles.item}  
                        ${item.component === 'textarea' ? styles.inputTextarea : ''}
                        ${item.component === 'alert' ? styles.alert : ''}
                        ${item.component === 'uploader' ? styles.uploader : ''}`}
                      key={item.index}
                    >
                      {item.component === 'alert' && (
                        <Alert
                          message={
                            <>
                              <div className={`${styles.icon}`}>{item.number}</div>
                              <div className={styles.split}></div>
                              {item.value && (
                                <div className={`${styles.message}`}>{item.value}</div>
                              )}
                            </>
                          }
                          type="info"
                          banner
                          showIcon={false}
                        />
                      )}
                      {item.component === 'textarea' && (
                        <TextArea
                          placeholder="请输入，可换行"
                          autoSize
                          value={item.value}
                          disabled
                        />
                      )}
                      {item.component === 'uploader' && <Uploader value={item.value} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingView}>
          <Drawer
            title="编辑属性"
            mask={false}
            placement={'right'}
            visible={editVisible}
            getContainer={false}
            style={{ position: 'absolute' }}
            width={400}
            closable={false}
          >
            <Form
              currentComponent={component}
              currentValue={(currentItem as any).value}
              active={active}
              onValuesChange={handleValuesChange}
            />
          </Drawer>
        </div>
      </DragDropContext>

      <div className={styles.saveButton}>
        <Button type="primary" onClick={handleSubmit}>
          保存
        </Button>
      </div>
    </div>
  );
};
