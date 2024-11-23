import React, { useState } from "react";
import dayjs from "dayjs";

interface Note {
    date: string;
    title: string;
}

interface CalendarProps {
    notes: Record<string, Note[]>;
    setNotes: React.Dispatch<React.SetStateAction<Record<string, Note[]>>>;
    onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ notes, setNotes }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
    const [selectingNoteToEdit, setSelectingNoteToEdit] = useState(false);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek)) {
        days.push(day);
        day = day.add(1, "day");
    }

    const handleAddOrEditNote = () => {
        if (!selectedDate) return;

        const updatedNotes = { ...notes };
        const dateNotes = updatedNotes[selectedDate] || [];

        if (editingNoteIndex !== null) {
            dateNotes[editingNoteIndex].title = newNoteTitle;
        } else {
            dateNotes.push({ date: selectedDate, title: newNoteTitle });
        }

        updatedNotes[selectedDate] = dateNotes;
        setNotes(updatedNotes);
        setModalOpen(false);
        setNewNoteTitle("");
        setEditingNoteIndex(null);
        setSelectingNoteToEdit(false);
    };

    const handleDeleteNote = () => {
        if (!selectedDate || editingNoteIndex === null) return;

        const updatedNotes = { ...notes };
        updatedNotes[selectedDate].splice(editingNoteIndex, 1);

        if (updatedNotes[selectedDate].length === 0) {
            delete updatedNotes[selectedDate];
        }

        setNotes(updatedNotes);
        setModalOpen(false);
        setNewNoteTitle("");
        setEditingNoteIndex(null);
        setSelectingNoteToEdit(false);
    };

    const handleEditNote = (date: string) => {
        const dateNotes = notes[date];
        if (!dateNotes) return;

        setSelectedDate(date);

        if (dateNotes.length > 1) {
            setSelectingNoteToEdit(true);
        } else {
            setEditingNoteIndex(0);
            setNewNoteTitle(dateNotes[0].title);
            setModalOpen(true);
        }
    };

    const handleSelectNoteToEdit = (index: number) => {
        setEditingNoteIndex(index);
        setNewNoteTitle(notes[selectedDate!][index].title);
        setModalOpen(true);
        setSelectingNoteToEdit(false);
    };

    const handleAddNewNote = (date: string) => {
        setSelectedDate(date);
        setEditingNoteIndex(null);
        setNewNoteTitle("");
        setModalOpen(true);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(event.target.value, 10);
        if (!isNaN(newYear)) {
            setCurrentDate(currentDate.year(newYear));
        }
    };

    return (
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCurrentDate(currentDate.subtract(1, "month"))} className="text-blue-600 hover:underline text-xl">Prev</button>

                <input
                    type="number"
                    value={currentDate.year()}
                    onChange={handleYearChange}
                    className="text-2xl font-bold w-24 text-center"
                />

                <button onClick={() => setCurrentDate(currentDate.add(1, "month"))} className="text-blue-600 hover:underline text-xl">Next</button>
            </div>

            <div className="grid grid-cols-7 gap-4 text-lg">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-semibold text-xl">{day}</div>
                ))}

                {days.map((day) => {
                    const formattedDate = day.format("YYYY-MM-DD");
                    const dateNotes = notes[formattedDate] || [];
                    const isToday = day.isSame(dayjs(), "day");
                    const isCurrentMonth = day.isSame(currentDate, "month");

                    return (
                        <div
                            key={day.toString()}
                            className={`relative border p-4 rounded-lg  ${
                                isToday ? "bg-green-600 text-white" : ""
                            } ${!isCurrentMonth ? "bg-gray-200 opacity-30" : "bg-gray-100"}`}
                        >
                            <div className="text-xl font-bold">{day.date()}</div>

                            <div className="absolute top-0 right-1 flex gap-2">
                                {dateNotes.length > 0 && isCurrentMonth && (
                                    <button onClick={() => handleEditNote(formattedDate)} className="p-1 rounded-full"> ✎ </button>
                                )}
                                {dateNotes.length < 3 && isCurrentMonth && (
                                    <button onClick={() => handleAddNewNote(formattedDate)} className="text-black p-1 rounded-full"> + </button>
                                )}
                            </div>

                            <div className="text-sm mt-2">
                                {dateNotes.map((note, index) => (
                                    <div key={index} className="text-gray-800">{note.title}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold mb-4">{editingNoteIndex !== null ? "Edit Note" : "Add Note"}</h2>
                        <input type="text" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} placeholder="Note title" className="w-full border p-3 rounded-lg mb-4" />
                        <div className="flex justify-end gap-4">
                            {editingNoteIndex !== null && (
                                <button onClick={handleDeleteNote} className="bg-red-500 text-white px-6 py-2 rounded-lg text-lg">Delete</button>
                            )}
                            <button onClick={handleAddOrEditNote} className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {selectingNoteToEdit && selectedDate && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-2xl font-bold mb-4">Select a Note to Edit</h2>
                        <div className="space-y-4">
                            {notes[selectedDate].map((note, index) => (
                                <button key={index} onClick={() => handleSelectNoteToEdit(index)} className="text-blue-600 hover:underline w-full text-left text-lg">
                                    {note.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
