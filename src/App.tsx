import React, { useState } from "react";
import Calendar from "./components/Calendar";
import Modal from "./components/Modal";

const App: React.FC = () => {
  const [notes, setNotes] = useState<Record<string, { date: string; title: string }[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const addNote = (date: string, title: string) => {
    setNotes((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), { date, title }],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-4">Calendar App</h1>
      <Calendar
        notes={notes}
        setNotes={setNotes} 
        onDateSelect={(date: string) => {
          setSelectedDate(date);
          setIsModalOpen(true);
        }}
      />
      {isModalOpen && (
        <Modal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSave={(title) => {
            addNote(selectedDate, title);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
