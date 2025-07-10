// app/conversation/[conversationKey].jsx

import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getMessagesByKey, postConversation } from '@/lib/controllers/ConversationController';
import { getUser } from '@/lib/controllers/UserController';
import { user } from '@/dev/temp';

export default function ConversationView() {
  const { conversationKey } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    (async () => {
      const fetched = await getMessagesByKey(conversationKey);
      setMessages(fetched ?? []);
    })();
  }, [conversationKey]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    await postConversation(conversationKey, user.uid, message.trim());
    const updated = await getMessagesByKey(conversationKey);
    setMessages(updated ?? []);
    setMessage('');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversation</Text>
      </View>
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ padding: 16 }}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <MessageItem key={index} msg={msg} isSelf={msg.uid === user.uid} />
        ))}
      </ScrollView>
      <View style={styles.inputBox}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Write your message..."
          multiline
          style={styles.textarea}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

function MessageItem({ msg, isSelf }) {
  const [sender, setSender] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser(msg.uid);
      setSender(u?.name ?? 'Unknown');
    })();
  }, [msg.uid]);

  return (
    <View style={[styles.messageItem, isSelf && styles.self]}>
      <Text style={styles.sender}>{sender}</Text>
      <Text>{msg.message}</Text>
      <Text style={styles.time}>{new Date(msg.created).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fffbc7' },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    elevation: 3,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e7b27',
  },
  list: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  inputBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  textarea: {
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  messageItem: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '90%',
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: '#f4fbe4',
  },
  sender: {
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    textAlign: 'right',
  },
});
