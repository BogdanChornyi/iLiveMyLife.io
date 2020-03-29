import React, { Component } from "react";
import {PageHeader, Tag, Typography, Descriptions, Row } from "antd";
import RemoveItem from "./RemoveItem";
import EditItem from "./EditItem";
const { Paragraph } = Typography;

export default class ItemTitle extends Component {
    editItem = () => {
        this.props.editItem(this.props.item);
    };

    removeItem = () => {
        this.props.removeItem(this.props.item);
    };

    render() {
        return (
            <div>
                <PageHeader
                    title={this.props.item.title}
                    extra={[
                        <EditItem key="1" onEdit={this.editItem} />,
                        "  |",
                        <RemoveItem key="2" onRemove={this.removeItem} />
                    ]}
                >
                    <Row>
                        <Paragraph>{this.props.item.description}</Paragraph>
                    </Row>

                    <Row>
                        <Descriptions size="small" column={2}>
                            <Descriptions.Item label="Status">
                                <Tag color="blue">Active</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">Ilya Sorokin</Descriptions.Item>
                            <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
                            <Descriptions.Item label="Due Date">2017-10-10</Descriptions.Item>
                        </Descriptions>
                    </Row>

                    <Row>
                        <Descriptions size="small" column={1}>
                            <Descriptions.Item label="Tags">
                                <Tag color="cyan">tag 1</Tag>
                                <Tag color="cyan">tag 2</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Row>
                </PageHeader>
            </div>
        );
    }
}