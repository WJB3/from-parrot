import React, { useEffect,useState } from 'react';
import { Tree } from 'antd';
import styles from './index.module.less';
import Api from '@/api/system/rtype'
import useExpandedKeys from '@/hooks/useExpandedKeys';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import ResourceTreeSelect from '@/components/ResourceTreeSelect';
import { Space, Radio,Form, Input, Button, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import UserTypeSelect from '@/components/UserTypeSelect';

const TreePage=(props)=>{

    const [treeList,setTreeList]=useState([]);

    const [form] = Form.useForm();

    const getList=()=>{
        Api.tree().then(res=>{
            console.log('res',res)
            setTreeList(res)
        });
    }

    useEffect(()=>{
        getList()
    },[]);

    const transformTree = (treeData) => {


        return treeData.map(item => {
            if (item.children && item.children.length) {
                let childrens = transformTree(item.children);
                return ({
                    title: item.name,
                    key: item.id,
                    children: childrens
                })
            }
            return ({
                title: item.name,
                key: item.id
            })
        })
    }

    const renderTreeData = transformTree(treeList); 

    const [expandedKeys, setExpandedKeys] = useExpandedKeys(treeList); 

    const [visible, setVisible] = useState(false);

    const [modalType, setModalType] = useState('add');

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add');
        form.resetFields();
        form.setFieldsValue({
            readonly:false
        });
    }

    const onClickExpand=(expandedKeys,{expanded:expand,node:current})=>{ 
        console.log("onClickExpand",expand,current)
        const newExpandedKeys=[...expandedKeys];
        const index=expandedKeys.indexOf(current.id);
        if(!expand){
            //??????
            newExpandedKeys.splice(index,1);
        }else{
            newExpandedKeys.push(current.id);
        }
        setExpandedKeys(newExpandedKeys);
    }
 

    const [current, setCurrent] = useState({});

    const [addLoading, setAddLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
        if (values.roleNames && values.roleNames.length) {
            values.roleNames = values.roleNames.join(",")
        }
        setAddLoading(true);
        if (modalType === 'add') {
            Api.add(values).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        } else {
            Api.edit({
                ...values,
                id: (current as any).id
            }).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        }

    };

    const selectedKeys=[props.foldId]

    

    return (
        <div className={styles.treeList}>
            <div className={styles.header}>
                <CustomButton type="add"   addText={'???????????????'} onClick={()=>handleShowVisible()}></CustomButton>
            </div>
            <div className={styles.cotent}>
                <Tree
                    showLine={true}
                    showIcon={true}  
                    blockNode 
                    treeData={renderTreeData}
                    expandedKeys={expandedKeys}
                    onExpand={onClickExpand}
                    selectedKeys={selectedKeys}
                    onSelect={props?.onSelect}
                />
            </div>
            <CustomModal
                visible={visible}
                title={'????????????'}
                type={modalType}
                size="default"
                clickCancel={() => setVisible(false)}
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    form={form}
                    {...layout}
                >
                    <Form.Item
                        label="??????"
                        name="pid"
                    >
                        <ResourceTreeSelect />
                    </Form.Item>

                    <Form.Item
                        label="??????"
                        name="name"
                        rules={[{ required: true, message: '??????????????????!' }]}
                    >
                        <Input placeholder={"?????????????????????"} />
                    </Form.Item>


                    <Form.Item
                        label="??????"
                        name="readonly"
                        rules={[{ required: true, message: '????????????!' }]}
                    >
                        <Radio.Group >
                            <Radio value={true}>???</Radio> 
                            <Radio value={false}>???</Radio> 
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="?????????"
                        name="seeType"
                        rules={[{ required: true, message: '???????????????!' }]}
                    >
                        <UserTypeSelect />
                    </Form.Item>

                    <Form.Item
                        label="??????"
                        name="folderDesc"
                    >
                        <Input.TextArea placeholder={"??????????????????????????????"} />
                    </Form.Item>



                    <Form.Item {...tailLayout}>
                        <Space align="end" style={{ float: 'right' }}>
                            <Button type="primary" htmlType="submit" loading={addLoading}>
                                ??????
                            </Button>
                            <Button type="default" onClick={() => setVisible(false)} >
                                ??????
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </CustomModal>
        </div>
    )
}


export default TreePage;