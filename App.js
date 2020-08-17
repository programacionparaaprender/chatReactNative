import React from 'react'
import { Platform } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils'

import SlackMessage from './SlackMessage'
//import SocketIOClient from  'sockect.io-client'
import io from 'socket.io-client';


export default class App extends React.Component {
  state = {
    messages: [],
    userId: null
  }
  constructor(props){
    super(props);
    this.socket = io('http://localhost:3000');
    
    this.socket.on('connect', function(){
      console.log('se realizo la conección.')
    });
    this.socket.on('chat', function(data){
      /* feedback.innerHTML = '';
      output.innerHTML += '<p><strong>' + data.baslik + ': </strong>' + data.mesaj + '</p>'; */
      console.log('data:'+JSON.stringify(data))
    });
  }
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer!!!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
    
  }

  onSend(messages = []) {
    /* this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    })) */
    this.socket.emit('chat', {
      mesaj: 'mesaj.value',
      baslik: 'baslik.value'
    });
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  render() {
    /* return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
          name: 'Luis Correa',
          avatar: 'https://placeimg.com/140/140/any',
        }}
        renderMessage={this.renderMessage}
      />
    ) */
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
          name: 'Luis Correa',
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
    )
  }
}

//module.exports = App