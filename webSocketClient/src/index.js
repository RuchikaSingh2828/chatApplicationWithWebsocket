import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input , Typography, message} from 'antd';
import 'antd/dist/antd.css';
import './index.css';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new W3CWebSocket('ws://10.209.9.128:8000')

export default class App extends Component {

    state = {
        userName: '',
        isLoggedIn: false, 
        messages: []
    }

    onButtonClicked = (value) => {
        // Push messages to server
        client.send(JSON.stringify({
            type: "message",
            msg: value,
            user: this.state.userName
        }));

        this.setState({
            searchVal:''
        })
    }

    componentDidMount(){
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }

        // As we have implemented to send us whatever messages we have sent tothe client we can check below
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('got Reply !! ', dataFromServer);

            if(dataFromServer.type === 'message'){
                this.setState((state) => ({
                    messages: [ ...state.messages, 
                        {
                            msg: dataFromServer.msg,
                            user: dataFromServer.user
                        }
                    ]
                }))
            }

        }
    }

    render(){
        return (
            <div className="main">
                {this.state.isLoggedIn ? 
                <div>
                    {/* <button onClick={() => this.onButtonClicked("Hello!!")}>
                        Send Messages
                    </button> */}
                    <div className="title">
                        <Text type="secondary" style={{ fonstSize: '36px' }}>
                            WebSocket Chat
                        </Text>
                    </div>
                    {/* list of messages */}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }}>
                        {this.state.messages.map(message => 
                            <Card 
                                key={message.msg} 
                                style={{ 
                                    width: 300, 
                                    margin: '16px 4px 0 4px', 
                                    alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start' }}
                                    
                                    >
                                <Meta
                                    avatar ={
                                        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf'}}>{message.user[0].toUpperCase()}</Avatar>
                                    } 
                                title={message.user}
                                description={message.msg}
                                />
                            </Card>
                        )}
                    </div>
                    <div className="bottom">
                        <Search
                            placeholder="input message and send"
                            enterButton="Send"
                            value={this.state.searchVal}
                            size="large"
                            onChange={ e => this.setState({ searchVal: e.target.value })}
                            onSearch={ value => this.onButtonClicked(value)}
                        />
                    </div>
                    {/* {this.state.messages.map(msg => <p> message: {msg.msg}, user: {msg.user})</p>)} */}
                </div>    
                :
                    <div style={{ padding: '200px 40px' }}>
                        <Search
                            placeholder="Enter Username"
                            enterButton="Login"
                            size="large"
                            onSearch={value => this.setState({ 
                                isLoggedIn: true,
                                userName : value
                             })}
                        />
                    </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))