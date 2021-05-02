import React, { useState } from "react";
import Tab from './Tab';

import "./Tabs.css";


interface TabsProps {
    children: JSX.Element[],
}

const Tabs = (props: TabsProps) => {
    const [activeTab, setActiveTab] = useState(props.children[0].props['data-label']);


    const onClickTabItem = (tab: string) => {
        setActiveTab(tab);
    }

    console.log(props.children);
    return (
        <div className="tabs">
            <ol className="tab-list">
                {props.children.map((child:any) => {
                    
                    const label = child.props['data-label'];
                    return (
                        <Tab
                            activeTab={activeTab}
                            key={label}
                            label={label}
                            onClick={onClickTabItem}
                        />
                    );
                })}
            </ol>
            <div className = "tab-content">
                {props.children.map((child: any) => {
                    const label = child.props['data-label'];
                    if (label !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
        </div>
    )
}

export default Tabs;
