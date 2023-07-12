import BackNavBar from "../components/BackNavBar";
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Symptoms from "../assets/symptoms.json";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { firestorage } from "../firebaseConfig";
import { symptom_checker_api_key, hashed_credentials } from "../firebaseConfig";

var DecisionTree = require("decision-tree");
const conditions = {
  "Abdominal pain": /(abdominal\s?pain)|(stomach\s?ache)/i,
  Anxiety: /anxiety|anxious|nervous|nervousness|anxiousness/i,
  "Back pain": /back\s?(pain|ache)/i,
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
  Nervousness: /nervousness|nervous/i,
  "Night cough": /night\s?cough/i,
  "Pain in the limbs": /pain\s?in\s?the\s?limbs/i,
  "Pain on swallowing": /pain\s?on\s?swallowing/i,
  Palpitations: /palpitations/i,
  Paralysis: /paralysis/i,
  "Reduced appetite": /reduced\s?appetite/i,
  "Runny nose": /runny\s?nose/i,
  "Shortness of breath": /shortness\s?of\s?breath/i,
  "Skin rash": /skin\s?rash/i,
  Sleeplessness: /sleeplessness|cannot\s?sleep|can't\s?sleep|insomnia/i,
  Sneezing: /sneezing|sneeze/i,
  "Sore throat": /sore\s?throat/i,
  Sputum: /sputum/i,
  "Stomach burning": /stomach\s?burning/i,
  "Stuffy nose": /stuffy\s?nose/i,
  Sweating: /sweating|sweat/i,
  "Swollen glands in the armpits": /swollen\s?glands\s?in\s?the\s?armpits/i,
  "Swollen glands on the neck": /swollen\s?glands\s?on\s?the\s?neck/i,
  Tears: /tears/i,
  Tiredness: /tiredness|tired/i,
  "Tremor at rest": /tremor\s?at\s?rest/i,
  "Unconsciousness, short": /unconscious|faint/i,
  Vomiting: /vomiting|vomit/i,
  "Vomiting blood": /(vomiting\s?blood)|(vomit\s?blood)/i,
  Weakness: /weakness|weak/i,
  "Weight gain": /weight\s?gain/i,
  Wheezing: /wheezing|wheez/i,
};
export default function ChatBotPage({ navigation, gender, dateOfBirth }) {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const yearOfBirth = dateOfBirth.substring(6, 10);
  const sex = gender == "Prefer not to say" ? "Male" : gender;
  const doctor = {
    _id: 2,
    name: "Doctor",
    avatar: require("../assets/doctor.png"),
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
    getToken();
  }, []);
  const getToken = async () => {
    const requested_uri = `https://sandbox-authservice.priaid.ch/login`;
    if (token == "") {
      try {
        const response = await axios.post(requested_uri, null, {
          headers: {
            Authorization: `Bearer ${symptom_checker_api_key}:${hashed_credentials}`,
          },
        });
        setToken(response.data.Token);
        console.log("Token set");
      } catch (error) {
        console.error(error);
        return;
      }
    }
  };

  const fetchDiagnosis = async (symptoms: Number[]) => {
    const url = "https://sandbox-healthservice.priaid.ch/diagnosis?token=" + token + "&language=en-gb&symptoms=" + "[" + symptoms + "]" + "&gender=" + sex + "&year_of_birth=" + yearOfBirth;
    const response = await fetch(url);
    const data = await response.json();
    const result = [];
    for (const diagnosis of data) {
      const issue = diagnosis.Issue;
      const { Accuracy, ID, Icd, IcdName, Name, ProfName, Ranking } = issue;
      result.push({ Accuracy: Accuracy, Name: Name });
    }
    return result;
  };

  // Main Algorithm
  const getDiagnosis = async (replyText) => {
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
    if (symptomsIds.length === 0) {
      return [];
    } else {
      const diagnosis = await fetchDiagnosis(symptomsIds);
      return diagnosis;
    }
  };

  const onSend = async (messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    const replyText = messages[0].text;
    setIsTyping(true);
    try {
      const diagnosis = await getDiagnosis(replyText);
      const medication = await getMedications(replyText);
      var response = {};
      if (diagnosis.length === 0) {
        response = { _id: Math.round(Math.random() * 1000000), text: "Sorry, we do not have any possible diagnosis for the given symptoms", createdAt: new Date(), user: doctor };
      } else {
        var diagnosisText = "";
        for (var length = 0; length < diagnosis.length; length++) {
          const issue = diagnosis.at(length);
          diagnosisText += `${length + 1}. ${issue.Name} (${Math.round(issue.Accuracy)}%)\n`;
        }
        var medicationText = "";
        if (medication == "") {
          medicationText = "No medications found";
        } else {
          medicationText = `Here are some medications that others are taking for your symptoms:\n${medication}`;
        }
        response = { _id: Math.round(Math.random() * 1000000), text: `Here are some possible diagnosis for your given symptoms:\n${diagnosisText}\n${medicationText}\n\n⚠️This is not an official diagnosis. Please consult a doctor for professional advice`, createdAt: new Date(), user: doctor };
      }
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [response]));
    } catch (error) {
      console.error(error);
    }
    setIsTyping(false);
  };

  async function getMedications(replyText) {
    const conditions = {
      Pain: /(back|neck|muscle)?\s?(pain|ache)/i,
      Cough: /cough/i,
      Eye: /(eye\s?redness)|(itching\s?eyes)/i,
      Fever: /fever/i,
      Headache: /head\s?ache/i,
      Heartburn: /(heart|stomach)\s?burn/i,
      Nausea: /nausea/i,
      "Runny nose": /runny\s?nose/i,
      "Skin rash": /skin\s?rash/i,
      "Sore throat": /sore\s?throat/i,
    };
    const matches = {};
    for (const condition in conditions) {
      if (Object.hasOwnProperty.call(conditions, condition)) {
        const regex = conditions[condition];
        if (replyText.match(regex)) {
          matches[condition] = true;
        } else {
          matches[condition] = false;
        }
      }
    }
    async function getData() {
      const ref = doc(firestorage, "MedicationRecommendations", "allEvents");
      const snapshot = await getDoc(ref);
      const allEvents = snapshot.data().all;
      return allEvents;
    }
    if (Object.values(matches).every((value) => value === false)) {
      return "";
    }
    const trainingData = await getData();
    var class_Name = "Name";
    var features = ["Pain", "Cough", "Eye", "Fever", "Headache", "Heartburn", "Nausea", "Runny nose", "Skin rash", "Sore throat"];
    var dt = new DecisionTree(trainingData, class_Name, features);
    var result = dt.predict(matches);
    return result;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackNavBar navigation={navigation} title="DocBot" />
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
