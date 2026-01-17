import { Colors } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type ChatMessageProps = {
  message: string;
  sender: 'user' | 'ai';
  senderName?: string;
  isTyping?: boolean;
};

export function ChatMessage({ message, sender, senderName, isTyping = false }: ChatMessageProps) {
  const isUser = sender === 'user';
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isTyping && !isUser) {
      // Inicia a animação de escrita
      if (currentIndex === 0) {
        setDisplayedText('');
        setCurrentIndex(0);
      }
      
      if (currentIndex < message.length) {
        const timer = setTimeout(() => {
          setDisplayedText(message.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 60); // Velocidade de digitação (60ms por letra - mais lenta)

        return () => clearTimeout(timer);
      }
    } else if (!isTyping && !isUser) {
      // Quando terminar de digitar, mostra a mensagem completa
      setDisplayedText(message);
      setCurrentIndex(message.length);
    } else if (isUser) {
      // Mensagens do usuário sempre aparecem completas
      setDisplayedText(message);
      setCurrentIndex(message.length);
    }
  }, [isTyping, currentIndex, message, isUser]);

  // Reset quando a mensagem mudar ou isTyping mudar
  useEffect(() => {
    if (isTyping && !isUser) {
      setDisplayedText('');
      setCurrentIndex(0);
    } else if (!isUser) {
      setDisplayedText(message);
      setCurrentIndex(message.length);
    }
  }, [message, isTyping]);

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {senderName && !isUser && (
          <TextUI variant="semibold" style={styles.senderName}>
            {senderName}
          </TextUI>
        )}
        <View style={styles.textContainer}>
          <TextUI variant="regular" style={[styles.messageText, isUser && styles.userMessageText]}>
            {displayedText}
          </TextUI>
          {isTyping && currentIndex < message.length && (
            <View style={styles.cursor} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#E5E5E5',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: Colors.light.white,
    marginBottom: 4,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.white,
  },
  userMessageText: {
    color: Colors.light.mainText,
  },
  cursor: {
    width: 2,
    height: 16,
    backgroundColor: Colors.light.white,
    marginLeft: 2,
  },
});

