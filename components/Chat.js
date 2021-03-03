import React, { useEffect, useState } from 'react';
import { useDarkMode } from 'next-dark-mode';

import mqtt from 'mqtt';
import styles from './Chat.module.css';

export default function Chat({ clientId, room = 'global' }) {
  const { darkModeActive } = useDarkMode();

  const clientRef = React.useRef(null);
  const [messages, setMessages] = useState([]);

  const addMessage = () => {
    const newMessages = messages.concat(Math.random());
    setMessages(newMessages);
  };

  const send = msg => {
    clientRef.current.publish('/ptut-student-workspace/chat/' + room, JSON.stringify({ clientId, msg }));
  };

  useEffect(() => {
    // access client vis clientRef.current
    console.dir(clientRef.current);
    if (!clientRef.current) {
      clientRef.current = mqtt.connect('mqtt://test.mosquitto.org:8081', { protocol: 'mqtts', reconnectPeriod: 20, clientId });
      clientRef.current.subscribe('/ptut-student-workspace/chat/' + room);

      clientRef.current.on('connect', () => {
        console.log('Client #' + clientId + ' >> connected');
      })

      clientRef.current.on('error', console.error);
      clientRef.current.stream.on('error', console.error);

      clientRef.current.on('message', (topic, message) => {
        console.log(message.toString());
        setMessages(messages.concat(JSON.parse(message)));
      });

      console.log('Client #' + clientId + ' :', clientRef.current);
    }
    else if (clientRef.current.disconnected)
      clientRef.current.reconnect();

    return () => {
      // always clean up the effect if clientRef.current has a value
      if (clientRef.current) {
        clientRef.current.unsubscribe('test');
        clientRef.current.end(clientRef.current);
      }
    };
  });

  return (
    <>
      <h2 style={{ margin: '0.5em 0 0.5em 0.3em' }}>
        Chat: <code style={{ color: 'red' }}>{room}</code>
      </h2>

      <div className={styles.ringContainer}>
        <div className={styles.ringring}></div>
        <div className={styles.circle}></div>
      </div>

      <textarea className={[styles.textarea, darkModeActive ? styles['textarea-dark'] : ''].join(' ')} value={messages.map(x => x.userId + ' : ' + x.msg).join('\n')} readOnly></textarea>
      <div style={{ display: 'flex', width: '100%' }}>
        <input type="text" placeholder="Ecrire un message" />
        <button onClick={() => send('test')}>Envoyer</button>
      </div>
    </>
  );
};
