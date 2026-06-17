import { createContext, useContext, useEffect, useState } from 'react';

const RentalContext = createContext();

export function RentalProvider({ children }) {
  const [rentalList, setRentalList] = useState(() => {
    const saved = localStorage.getItem('rentalList');
    return saved ? JSON.parse(saved) : [];
  });

  // 儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('rentalList', JSON.stringify(rentalList));
  }, [rentalList]);

  // 加入作品
  const addToRental = (work) => {
    const exists = rentalList.some((item) => item.id === work.id);

    if (!exists) {
      setRentalList((prev) => [...prev, work]);
    }
  };

  // 移除作品
  const removeFromRental = (id) => {
    setRentalList((prev) => prev.filter((item) => item.id !== id));
  };

  // 清空
  const clearRental = () => {
    setRentalList([]);
  };

  // 是否已加入
  const isInRental = (id) => {
    return rentalList.some((item) => item.id === id);
  };

  return (
    <RentalContext.Provider
      value={{
        rentalList,
        addToRental,
        removeFromRental,
        clearRental,
        isInRental,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  return useContext(RentalContext);
}
