import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import SignOut from "../components/SignOut";
import AppIcon from "../../assets/app_icon.png";
import ChatIcon from "../../assets/chat_icon.png";
import BackIcon from "../../assets/back_chat.png";
import { Audio } from 'expo-av';

const ChatScreen = () => {
    const [recording, setRecording] = useState();
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState('English'); // New state for language
    const [jsonData, setJsonData] = useState({
        ChatBot: {
            Back: "Back",
            HELP: "Help",
            TypeHere: "Type Here..",
            PermissionsRequired: "a",
            PleaseGrantAudioRecordingPermissions: "b",
            RecrodingFailed: "c",
            AnErrorOccuredWhileTryingToStartRecording: "d",
        }
    });
    const navigation = useNavigation();

    useEffect(() => {
        // Update jsonData based on the selected language
        const languageData = {
            English: {
                ChatBot: {
                    Back: "Back",
                    HELP: "Help",
                    TypeHere: "Type Here..",
                    PermissionsRequired: "Permissions Required",
                    PleaseGrantAudioRecordingPermissions: "Please grant audio recording permissions",
                    RecrodingFailed: "Recording Failed",
                    AnErrorOccuredWhileTryingToStartRecording: "An error occurred while trying to start recording",
                }
            },
            Hindi: {
                ChatBot: {
                    Back: "वापस",
                    HELP: "मदद",
                    TypeHere: "यहाँ टाइप करें..",
                    PermissionsRequired: "अनुमतियाँ आवश्यक",
                    PleaseGrantAudioRecordingPermissions: "कृपया ऑडियो रिकॉर्डिंग अनुमतियाँ प्रदान करें",
                    RecrodingFailed: "रिकॉर्डिंग विफल",
                    AnErrorOccuredWhileTryingToStartRecording: "रिकॉर्डिंग शुरू करने का प्रयास करते समय एक त्रुटि हुई",
                }
            },
            Tamil: {
                ChatBot: {
                    Back: "பின்னால்",
                    HELP: "உதவி",
                    TypeHere: "இங்கே தட்டச்சு செய்யவும்..",
                    PermissionsRequired: "அனுமதிகள் தேவை",
                    PleaseGrantAudioRecordingPermissions: "ஆடியோ பதிவேற்ற அனுமதிகளை வழங்கவும்",
                    RecrodingFailed: "பதிவேற்றம் தோல்வி",
                    AnErrorOccuredWhileTryingToStartRecording: "பதிவேற்ற முயற்சி செய்தபோது ஒரு பிழை ஏற்பட்டது",
                }
            },
            Telugu: {
                ChatBot: {
                    Back: "తిరిగి వెళ్ళు",
                    HELP: "సహాయం",
                    TypeHere: "ఇక్కడ టైప్ చేయండి..",
                    PermissionsRequired: "అనుమతులు అవసరం",
                    PleaseGrantAudioRecordingPermissions: "దయచేసి ఆడియో రికార్డింగ్ అనుమతులను ఇవ్వండి",
                    RecrodingFailed: "రికార్డింగ్ విఫలమైంది",
                    AnErrorOccuredWhileTryingToStartRecording: "రికార్డింగ్ ప్రారంభించడానికి ప్రయత్నించినప్పుడు లోపం సంభవించింది",
                }
            }
        };
        setJsonData(languageData[language]);
    }, [language]);

    const sendMessage = async () => {
        if (messageText.trim()) {
            const newMessage = { id: Date.now(), text: messageText, sender: 'user', language: language };
            setMessages([...messages, newMessage]);
            setIsLoading(true);
            setMessageText('');
            console.log(newMessage);
            try {
                const baseUrl = "http://192.168.10.4:8000";
                const endpoint = `${baseUrl}/chattext`;
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: newMessage.text, language: language }),
                });
                const responseData = await response.json();
                console.log(responseData)
                if (responseData.success) {
                    setMessages([...messages, { ...newMessage, id: Date.now() }, { id: Date.now() + 1, text: responseData.message, sender: 'bot' }]);
                    console.log(responseData.message);
                } else {
                    throw new Error(responseData.message || "Server error");
                }
            } catch (error) {
                console.error('Error fetching response:', error);
                setMessages(prevMessages => [...prevMessages, newMessage, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = async () => {
        navigation.navigate('Dashboard_pass');
    }

    const handleAccount = async () => {
        navigation.navigate('Account');
    }

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setRecording(recording);
                setIsListening(true);
            } else {
                Alert.alert(
                    jsonData.ChatBot.PermissionsRequired,
                    jsonData.ChatBot.PleaseGrantAudioRecordingPermissions
                );
            }
        } catch (err) {
            Alert.alert(
                jsonData.ChatBot.RecrodingFailed,
                jsonData.ChatBot.AnErrorOccuredWhileTryingToStartRecording
            );
        }
    }

    async function stopRecording() {
        try {
            setRecording(undefined);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording stopped and stored at", uri);
            sendAudioToServer(uri);
            setIsListening(false);
        } catch (error) {
            console.error("Stop recording error:", error);
        }
    }

    const sendAudioToServer = async (audioPath) => {
        const formData = new FormData();
        formData.append("file", {
            uri: audioPath,
            type: "audio/3gp", // Make sure the MIME type matches the actual file format
            name: "audio.3gp",
        });
        formData.append("language", language);

        try {
            const baseUrl = "http://192.168.10.4:8000"
            console.log('Sending audio to server with the following formData:', formData);

            const response = await fetch(`${baseUrl}/chat_audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (data.success) {
                setMessageText(data.message);  // Set the TextInput with the transcribed text
            } else {
                throw new Error(data.message || "Server error");
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Error getting response', sender: 'bot' }]);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.containkeyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 2} // Adjust this value if needed
        >
            {/* Header */}
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.backLogo}>
                        <TouchableOpacity style={styles.back_view} onPress={handleBack}>
                            <Image source={BackIcon} style={styles.back_icon} />
                        </TouchableOpacity>
                        <Image source={AppIcon} style={styles.app_icon} />
                    </View>
                    <View style={styles.helpSection}>
                        <Dropdown
                            style={styles.dropdown}
                            data={[
                                { label: 'English', value: 'English' },
                                { label: 'Hindi', value: 'Hindi' },
                                { label: 'Tamil', value: 'Tamil' },
                                { label: 'Telugu', value: 'Telugu' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select language"
                            value={language}
                            onChange={item => {
                                setLanguage(item.value);
                            }}
                        />
                        <SignOut />
                        <View style={styles.chat_icon_container}>
                            <Image source={ChatIcon} style={styles.chat_icon} />
                        </View>
                    </View>
                </View>

                {/* Main message panel */}
                <ScrollView style={styles.messagesContainer}>
                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                            <Text style={[styles.messageText, msg.sender === 'user' ? styles.userMessageText : styles.botMessageText]}>{msg.text}</Text>
                        </View>
                    ))}
                    {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
                </ScrollView>

                {/* Input Box */}
                <View style={styles.inpCont}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder={jsonData.ChatBot.TypeHere}
                        />
                        <TouchableOpacity style={styles.audioButton} onPress={isListening ? stopRecording : startRecording}>
                            <Icon source={isListening ? "stop" : "microphone"} size={26} style={styles.icon}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Icon source="send" size={26} style={styles.icon}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    containkeyboard: {
        flex: 1,
    },
    container: {
        flex: 1,
        // paddingTop: 20
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 52,
        padding: 12,
        borderBottomColor: "#B6B6B6",
        borderBottomWidth: 0.5,
        backgroundColor: "white",
        elevation: 18,
        zIndex: 999
    },
    back_view: {
        // paddingTop: 36,
        // paddingBottom: 4,
        paddingLeft: 4,
        backgroundColor: "white",
        zIndex: 9999999
    },
    back_icon: {
        width: 10,
        height: 20
    },
    app_icon: {
        height: 45,
        width: 65
    },
    backLogo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20
    },
    chat_icon: {
        width: 28.83,
        height: 24,
        marginLeft: 4
    },
    chat_icon_container: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#E8EEF3"
    },
    back: {
        flexDirection: "row",
        alignItems: "center"
    },
    backTxt: {
        paddingHorizontal: 6,
        fontSize: 18,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
        color: "#224c6a",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
        textAlign: "left",
    },
    helpSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    helpButton: {
        backgroundColor: "green",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
    },
    helpText: {
        color: "white",
        fontSize: 16,
    },
    account: {
        marginLeft: 12,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: "#E7ECEF",
    },
    message: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 6,
        maxWidth: '80%',
    },
    userMessage: {
        // backgroundColor: '#add8e6',
        alignSelf: 'flex-end',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 2,
        borderBottomLeftRadius: 30,
        backgroundColor: "#fff",
        // flex: 1,
        // width: "100%",
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 18,
        // paddingVertical: 16
    },
    botMessage: {
        // backgroundColor: '#90ee90',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 2,
        backgroundColor: "#002e4f",
        flex: 1,
        // width: "100%",
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 18,
        // paddingVertical: 12
    },
    userMessageText: {
        fontSize: 16,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
        color: "#002e4f",
        textAlign: "left"
    },
    botMessageText: {
        fontSize: 16,
        fontWeight: "500",
        // fontFamily: "Inter-Medium",
        color: "#fff",
        textAlign: "left",
    },
    inpCont: {
        backgroundColor: "#E7ECEF",

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 14,
        borderRadius: 40,
        backgroundColor: "white",
        shadowColor: "rgba(0, 0, 0, 0.45)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 8,
        shadowOpacity: 1,
        zIndex: 99999999999,
        elevation: 4
    },
    input: {
        flex: 1,
        // height: 40,
        // paddingHorizontal: 2,
        paddingLeft: 14,
        paddingVertical: 14
    },
    sendButton: {
        padding: 10,
    },
    icon: {
        color: "#002E4F"
    },
    dropdown: {
        width: 120,
        height: 40,
        backgroundColor: '#E8EEF3',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
    }
});

export default ChatScreen;
