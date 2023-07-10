import BackNavBar from "../components/BackNavBar";
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Symptoms from "../assets/symptoms.json";

const key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImUwOTM0MTEyQHUubnVzLmVkdSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiMTI2MDQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMjMtMDctMTAiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTY4OTAwMzg2NywibmJmIjoxNjg4OTk2NjY3fQ.zEMZt7DYY3Smywv8ClY7hOCHqz0nzx7IHDWqPZXdZz8";
const conditions = {
  "Abdominal pain": /abdominal\s?pain/i,
  Anxiety: /anxiety/i,
  "Back pain": /back\s?pain/i,
  "Burning eyes": /burning\s?eyes/i,
  "Burning in the throat": /(burning\s?in\s?the\s?throat)|(throat\s?burn)/i,
  "Cheek swelling": /cheek\s?swelling/i,
  "Chest pain": /chest\s?pain/i,
  "Chest tightness": /chest\s?tight/i,
  Chills: /chills/i,
  "Cold sweats": /cold\s?sweat/i,
  Cough: /cough/i,
  Dizziness: /dizziness|dizzy/i,
  "Drooping eyelid": /drooping\s?eyelid/i,
  "Dry eyes": /dry\s?eyes/i,
  Earache: /earache/i,
  "Early satiety": /early\s?satiety/i,
  "Eye pain": /eye\s?pain/i,
  "Eye redness": /eye\s?redness/i,
  "Fast, deepened breathing": /fast,\s?deepened\s?breathing/i,
  "Feeling of foreign body in the eye": /feeling\s?of\s?foreign\s?body\s?in\s?the\s?eye/i,
  Fever: /fever/i,
  "Going black before the eyes": /going\s?black\s?before\s?the\s?eyes/i,
  Headache: /head\s?ache/i,
  Heartburn: /heart\s?burn/i,
  Hiccups: /hiccups/i,
  "Hot flushes": /hot\s?flushes/i,
  "Increased thirst": /increased\s?thirst/i,
  "Itching eyes": /itching\s?eyes/i,
  "Itching in the nose": /itching\s?in\s?the\s?nose/i,
  "Lip swelling": /lip\s?swelling/i,
  "Memory gap": /memory\s?gap/i,
  "Menstruation disorder": /menstruation\s?disorder/i,
  "Missed period": /missed\s?period/i,
  Nausea: /nausea/i,
  "Neck pain": /neck\s?pain/i,
  Nervousness: /nervousness/i,
  "Night cough": /night\s?cough/i,
  "Pain in the limbs": /pain\s?in\s?the\s?limbs/i,
  "Pain on swallowing": /pain\s?on\s?swallowing/i,
  Palpitations: /palpitations/i,
  Paralysis: /paralysis/i,
  "Reduced appetite": /reduced\s?appetite/i,
  "Runny nose": /runny\s?nose/i,
  "Shortness of breath": /shortness\s?of\s?breath/i,
  "Skin rash": /skin\s?rash/i,
  Sleeplessness: /sleeplessness/i,
  Sneezing: /sneezing/i,
  "Sore throat": /sore\s?throat/i,
  Sputum: /sputum/i,
  "Stomach burning": /stomach\s?burning/i,
  "Stuffy nose": /stuffy\s?nose/i,
  Sweating: /sweating/i,
  "Swollen glands in the armpits": /swollen\s?glands\s?in\s?the\s?armpits/i,
  "Swollen glands on the neck": /swollen\s?glands\s?on\s?the\s?neck/i,
  Tears: /tears/i,
  Tiredness: /tiredness/i,
  "Tremor at rest": /tremor\s?at\s?rest/i,
  "Unconsciousness, short": /unconsciousness,\s?short/i,
  Vomiting: /vomiting/i,
  "Vomiting blood": /vomiting\s?blood/i,
  Weakness: /weakness/i,
  "Weight gain": /weight\s?gain/i,
  Wheezing: /wheezing/i,
};
export default function ChatBotPage({ navigation, gender, dateOfBirth }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const yearOfBirth = dateOfBirth.substring(6, 10);
  const sex = gender == "Prefer not to say" ? "Male" : gender;
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

  const fetchDiagnosis = async (symptoms: Number[]) => {
    const url = "https://sandbox-healthservice.priaid.ch/diagnosis?token=" + key + "&language=en-gb&symptoms=" + "[" + symptoms + "]" + "&gender=" + sex + "&year_of_birth=" + yearOfBirth;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  };

  // Main Algorithm
  const getDiagnosis = (replyText) => {
    const matches = [];
    for (const condition in conditions) {
      if (Object.hasOwnProperty.call(conditions, condition)) {
        const regex = conditions[condition];
        if (replyText.match(regex)) {
          matches.push(condition);
        }
      }
    }
    const symptomsIds = [];
    for (const matchedSymptom of matches) {
      const symptomId = Symptoms.find((symptom) => symptom.Name === matchedSymptom).ID;
      symptomsIds.push(symptomId);
    }
    const diagnosis = fetchDiagnosis(symptomsIds);
    return matches;
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    const replyText = messages[0].text;
    setIsTyping(true);
    const diagnosis = getDiagnosis(replyText);
    var response = {};
    if (diagnosis.length === 0) {
      response = { _id: Math.round(Math.random() * 1000000), text: "Sorry, we do not have any possible diagnosis for the given symptoms", createdAt: new Date(), user: doctor };
    } else {
      response = { _id: Math.round(Math.random() * 1000000), text: "These are some possible diagnosis for your given symptoms\n", createdAt: new Date(), user: doctor };
    }
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
