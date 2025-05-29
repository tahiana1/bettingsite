import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { wsURL } from '@/api';

interface Transaction {
  type: string;
  username: string;
  amount: number;
  timestamp: string;
}

const TransactionFeed: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(wsURL);
    
    socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const transaction = JSON.parse(event.data);
        setTransactions((prev) => {
          const newTransactions = [transaction, ...prev].slice(0, 10);
          return newTransactions;
        });
      } catch (error) {
        console.error('Error parsing transaction:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gray-800 text-white">
      <div className="animate-scroll">
        <List
          size="small"
          className="!w-full"
          dataSource={transactions}
          renderItem={(item) => (
            <List.Item className="w-full whitespace-nowrap">
              <span className={`mr-2 ${item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                {item.type === 'deposit' ? '↑' : '↓'}
              </span>
              <span className={`font-medium ${item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>{item.username}</span>
              <span className={`mx-2 ${item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>{item.type === 'deposit' ? 'Deposit' : 'Withdraw'}</span>
              <span className={`font-bold ${item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>{item.amount.toLocaleString()}</span>
              <span className="ml-2 text-gray-400">{item.timestamp}</span>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default TransactionFeed; 