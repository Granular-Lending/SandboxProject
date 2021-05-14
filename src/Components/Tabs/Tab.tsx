import React from "react";

interface TabProps {
    activeTab: string,
    label: string,
    onClick: (tab: string) => void,
}

const Tab = (props: TabProps) => {

    const onClick = () => {
        const { label, onClick } = props;
        onClick(label);
    }

    const { activeTab, label } = props;

    return (
        <li
            className={`tab-list-item ${activeTab === label ? "tab-list-active" : ""} `}
            onClick={onClick}
        >
            {props.label}
        </li>
    )

}

export default Tab;
