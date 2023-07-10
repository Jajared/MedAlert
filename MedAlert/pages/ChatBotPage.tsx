import BackNavBar from "../components/BackNavBar";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default function ChatBotPage({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const doctor = {
    _id: 2,
    name: "Doctor",
    avatar: require("../assets/jamal.png"),
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "What symptoms are you experiencing today?",
        createdAt: new Date(),
        user: doctor,
      },
    ]);
  }, []);

  // Main Algorithm
  const getRecommendedMedications = (replyText) => {
    const conditions = {
      cough: /cough/i,
      cold: /cold/i,
      fever: /fever/i,
      headache: /head\s?ache/i,
      soreThroat: /sore\s?throat/i,
      vomiting: /vomit/i,
      diarrhea: /diarrhea/i,
      stomachache: /stomach\s?ache/i,
      rash: /rash/i,
      chestPain: /chest\s?pain/i,
      dizziness: /dizziness/i,
    };
    const matches = [];
    for (const condition in conditions) {
      if (replyText.match(conditions[condition])) {
        matches.push(condition);
      }
    }
    console.log(matches);
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    const replyText = messages[0].text;
    setIsTyping(true);
    getRecommendedMedications(replyText);
    const response = { _id: Math.round(Math.random() * 1000000), text: "These are some recommended medications you can take!\n", createdAt: new Date(), user: doctor };
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [response]));
    setIsTyping(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="Chat Bot" />
      <View style={styles.content}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
          isTyping={isTyping}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { backgroundColor: "#ffffff", flex: 1 },
});
