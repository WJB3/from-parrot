import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import RoleSelect from '@/components/RoleSelect';
import roleApi from '@/api/permissions/admin'
import { Space, Card, Form, Input, Button,DatePicker, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

const { RangePicker } = DatePicker;

const Index = () => {

    const [form] = Form.useForm();

    const handleChangeState = (e, current) => {
        console.log("current", e, current);
        roleApi.edit({
            ...current,
            id: (current as any).id,
            state: e ? 0 : 1
        }).then(res => {

            getList();
        }).catch((e) => {
        })
    }

    const onResetPassword = (current) => {
        console.log("current", current)
        Modal.confirm({
            title: '信息',
            icon: <ExclamationCircleOutlined />,
            content: `确定要重置“${current.username}”的登录密码吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => roleApi.resetPassword(current.id).then(res => {
                message.success("密码重置成功，重置后的密码为：123456")
            }).catch(() => message.success("重置密码失败"))
        });
    }

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '名称',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, current) => {
                return (
                    <Switch checkedChildren="正常" unCheckedChildren="锁定" checked={value === 0} onChange={(e) => handleChangeState(e, current)} />
                )
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
                        <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                        <CustomButton type='warning' onClick={() => onResetPassword(record)}>重置密码</CustomButton>
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
        roleApi.getList({
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
        if (values.roleNames && values.roleNames.length) {
            values.roleNames = values.roleNames.join(",")
        }
        setAddLoading(true);
        if (modalType === 'add') {
            roleApi.add(values).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        } else {
            roleApi.edit({
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

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination
        })
    }
    //删除全部
    const handleDeleteRoles = (deleteIds) => {
        roleApi.delete(deleteIds).then(res => {
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
            onOk: () => roleApi.delete([current.id]).then(res => {
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

    const handleSearchKeys = () => {
        getList();
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

    const tableTopComponent = (
        <>
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
                    type={modalType}
                    size="small"
                    clickCancel={() => setVisible(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        {...layout}
                    >
                        <Form.Item
                            label="账号"
                            name="account"
                            rules={[{ required: true, message: '账号必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="姓名"
                            name="username"
                            rules={[{ required: true, message: '姓名必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="手机号"
                            name="phone"

                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="角色"
                            name="roleNames"
                            rules={[{ required: true, message: '角色必选!' }]}
                        >
                            <RoleSelect />
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