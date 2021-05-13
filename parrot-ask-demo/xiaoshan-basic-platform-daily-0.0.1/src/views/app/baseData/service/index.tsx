import { Rect } from "bizcharts/lib/g-components";
import React from "react";
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import PageTab from 'src/components/PageTab';
import ServiceList from './Service';
import DepartmentTree from './Department';
import CompanyList from './Company';

export default function Customer(props: RouteComponentProps){
    return (
        <PageTab>
            {({ id, pageId, tab}) => (
                <div>
                    <PrivateComponent id={315}>{ tab==="315" && <ServiceList></ServiceList> }</PrivateComponent>
                    <PrivateComponent id={316}>{ tab==="316" && <DepartmentTree></DepartmentTree>}</PrivateComponent>
                    <PrivateComponent id={317}>{ tab==="317" && <CompanyList></CompanyList>}</PrivateComponent>
                </div>
            )}
        </PageTab>
    );
}