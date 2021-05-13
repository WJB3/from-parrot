import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import UserSelectAboutCompany from '@/components/UserSelectAboutCompany';
import PermissionTree from '@/components/PermissionTree'; 
import roleApi from '@/api/email/index'
import { Space, Form, Card, Input, Button,DatePicker, Modal, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';


const Index = () => {

    const [form] = Form.useForm();
 
    const columns = [

        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '发件人',
            dataIndex: 'title',
            key: 'title',
            render:()=>{
                return localStorage.getItem("CURRENTUSER") || 'admin'
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        {/* <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton> */}
                        <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                    </Space>
                )
            }
        }
    ];

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [searchKeys, setSearchKeys] = useState({
        title: "",
        searchDate: undefined
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');

    const [permissionVisible, setPermissionVisible] = useState(false);

    const [current, setCurrent] = useState({});

    const getList = () => {
        let newObj: any = {}
        if (searchKeys.title) {
            newObj.searchKey = searchKeys.title
        } 
        if (searchKeys.searchDate) {
            newObj.searchDate = `${searchKeys.searchDate[0].format(dateFormat)}-${searchKeys.searchDate[1].format(dateFormat)}`
        }
        roleApi.getSend({
            page: pagination.current,
            size: pagination.pageSize,
            ...newObj
        }).then((res: any) => {
            console.log("res", res)
            const { records, total } = res;
            setDataSource(records)
            setPagination({
                ...pagination,
                total: total
            })
        })
    }

    useEffect(() => {
        getList()
    }, [pagination.current, pagination.pageSize]);

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add')
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
        if (values.receive && values.receive.length) {
            values.receiveIds = values.receive.join(',');
            delete values.receive;
        }
        setAddLoading(true);
        if (modalType === 'add') {
            roleApi.send(values).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        } else {
            // roleApi.edit({
            //     ...values,
            //     id: (current as any).id
            // }).then(res => {
            //     setAddLoading(false);
            //     setVisible(false);
            //     getList();
            // }).catch((e) => {
            //     setAddLoading(false);
            // })
        }

    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination
        })
    }
    //删除全部
    const handleDeleteRoles = (deleteIds) => {
        roleApi.deleteSend(deleteIds).then(res => {
            getList();
        })
    }
    //删除单个
    const onDeleteItem = (current) => {
        console.log(current)
        Modal.confirm({
            title: '信息',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除选中数据吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => roleApi.deleteSend([current.id]).then(res => {
                getList();
            })
        });
    }

    const onEditItem = (current) => {
        setVisible(true);
        setModalType('edit')
        setCurrent(current)
        form.setFieldsValue({
            name: current.name,
            des: current.des
        })
    }


    const handleChange = (key) => (e) => {
        if (key === 'title') {
            setSearchKeys({
                ...searchKeys,
                title: e.target.value
            })
        } else if (key === 'Ranger') { 
            setSearchKeys({
                ...searchKeys,
                searchDate: e
            })
        }
    }

    const handleSearchKeys = () => {
        getList();
    }

    const tableTopComponent = (
        <>
            <div>
                标题：
            </div>
            <div>
                <Input placeholder={"请输入要搜索的标题"} value={searchKeys.title} onChange={handleChange('title')} />
            </div>
            <div>
                发件日期：
            </div>
            <div>
                <RangePicker value={searchKeys.searchDate} onChange={handleChange('Ranger')} />
            </div>
        </>
    )

    return (
        <div>
            <Card>
                <PermissionTree
                    visible={permissionVisible}
                    clickCancel={() => setPermissionVisible(false)}
                />

                <CustomTable
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                    onAdd={handleShowVisible}
                    onDelete={handleDeleteRoles}
                    customAddButtonText={"发送站内信"}
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'管理员'}
                    customTitle={"发送站内信"}
                    type={modalType}
                    size="big"
                    clickCancel={() => setVisible(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        {...layout}
                    >
                        <Form.Item
                            label="标题"
                            name="title"
                            rules={[{ required: true, message: '请输入信件内容!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="内容"
                            name="content"
                        >
                            <Input.TextArea rows={8} />
                        </Form.Item>

                        <Form.Item
                            label="收件人"
                            name="receive"
                        >
                            <UserSelectAboutCompany />
                        </Form.Item>


                        <Form.Item {...tailLayout}>
                            <Space align="end" style={{ float: 'right' }}>
                                <Button type="primary" htmlType="submit" loading={addLoading}>
                                    保存
                            </Button>
                                <Button type="default" onClick={() => setVisible(false)} >
                                    取消
                            </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </CustomModal>
            </Card>
        </div>
    )
}

export default Index;