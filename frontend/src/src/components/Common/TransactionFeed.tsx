import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { wsURL } from '@/api';
import dayjs from 'dayjs';

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
    <div className="w-full overflow-hidden text-white relative">
         {
            transactions.map((data, index) => {
              return (
                <tr key={index} className="flex py-4 items-center justify-between w-full border-b border-[#312807] hover:text-[#d5b270] cursor-pointer">
                  <td className={`text-xm flex items-center gap-1 ${data.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white" width="14" height="14" >
                      <path d="M224.5 160C224.5 147.1 232.3 135.4 244.3 130.4C256.3 125.4 270 128.2 279.1 137.4L439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C269.9 511.9 256.2 514.6 244.2 509.6C232.2 504.6 224.5 492.9 224.5 480L224.5 160z"/>
                    </svg>{data.username}
                  </td>
                  <td className={`mx-2 ${data.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                  </td>
                  <td className={`font-bold ${data.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.amount.toLocaleString()}
                  </td>  
                  <td className={`text-xm ${data.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                    {data.timestamp}
                  </td>
                </tr>
              )
            })
          }
    </div>
  );
};

export default TransactionFeed; 