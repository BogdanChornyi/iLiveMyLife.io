import React from 'react';
import { Comment, Tooltip } from "antd";
import { MESSAGES_PER_LOAD } from '../constants';
import './Messanger.css';
import {datetimeFromUnixTimestamp, fromNow} from "../util/Helpers";
import {MESSAGE_CREATED} from "../graphql/message";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreItems: true,
        };
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    componentDidMount() {
        this.unsubscribe = this.subscribe(this.props.itemId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.itemId !== this.props.itemId) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }

            this.unsubscribe = this.subscribe(this.props.itemId);
        }

        if (this.scroller
            && this.scroller.scrollTop < 100
            && prevProps.messages
            && this.props.messages
            && prevProps.messages.length !== this.props.messages.length
        ) {
            // 35 items
            const heightBeforeRender = this.scroller.scrollHeight;
            // wait for 70 items to render
            setTimeout(() => {
                if (this.scroller) {
                    this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
                }
            }, 120);
        }
    }

    handleScroll = () => {
        const { messages, fetchMore, itemId } = this.props;

        if (
            this.scroller &&
            this.scroller.scrollTop < 100 &&
            this.state.hasMoreItems &&
            messages.length >= MESSAGES_PER_LOAD
        ) {
            fetchMore({
                variables: {
                    itemId,
                    cursor: messages[0].createdAt,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }

                    if (fetchMoreResult.messages.length < MESSAGES_PER_LOAD) {
                        this.setState({ hasMoreItems: false });
                    }

                    return {
                        ...previousResult,
                        messages: [...fetchMoreResult.messages, ...previousResult.messages],
                    };
                },
            });
        }
    };

    subscribe = itemId =>
        this.props.subscribeToMore({
            document: MESSAGE_CREATED,
            variables: {
                itemId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return {
                    messages: [
                        ...prev.messages,
                        subscriptionData.data.messageCreated,
                    ],
                };
            },
        });

    render() {
        return (
            <div className="messagesContainer">
                <ul onScroll={this.handleScroll}
                    ref={(scroller) => {
                        this.scroller = scroller;
                    }}
                >
                    {this.props.messages
                        .slice()
                        .reverse()
                        .map(message => (
                            <Comment
                                style={{
                                    padding: '0px'
                                }}
                                key={message.id}
                                author={message.createdBy}
                                avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                content={message.content}
                                datetime={
                                    <Tooltip title={datetimeFromUnixTimestamp(message.createdAt)}>
                                        <span>{fromNow(message.createdAt)}</span>
                                    </Tooltip>
                                }
                            />)
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default Messages;
