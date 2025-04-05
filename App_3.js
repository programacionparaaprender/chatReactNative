import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

//import SocketIOClient from  'sockect.io-client'
import io from "socket.io-client";

import { GiftedChat } from "react-native-gifted-chat";

const USER_ID = "@userId";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: null,
    };
    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    //this.sockect = SocketIOClient('http://localhost:3000');
    this.socket = io("http://localhost:3000");
    /* this.socket.on('connect', function(){
      console.log('cliente conectado.')
    }); */
    this.socket.on("message", this.onReceivedMessage);
    this.determineUser();
  }
  determineUser() {
    AsyncStorage.getItem(USER_ID)
      .then((userId) => {
        if (!userId) {
          this.socket.emit("userJoined", null);
          this.socket.on("userJoined", (userId) => {
            AsyncStorage.setItem(USER_ID, userId);
            this.setState(userId);
          });
        } else {
          this.socket.emit("userJoined", userId);
          this.setState({ userId });
        }
      })
      .catch((e) => alert(e));
  }
  onReceivedMessage(messages) {
    console.log("messages 2: " + JSON.stringify(messages));
    this._storeMessages(messages);
  }
  onSend(messages = []) {
    console.log("messages: " + JSON.stringify(messages));
    this.socket.emit("message", messages[0]);
  }
  _storeMessages(messages) {
    //console.log('messages 3: '+JSON.stringify(messages))
    this.setState((previousState) => {
      //console.log('previousState: '+JSON.stringify(previousState))

      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  render() {
    var user = { _id: this.state.userId || -1 };
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={user}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
