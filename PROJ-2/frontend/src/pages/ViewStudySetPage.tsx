// Updated ViewStudySetPage.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import ViewStudySetUI from "../components/ViewStudySetUI";

const ViewStudySetPage = () => {
  let _ud: any = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let Id: string = ud.id;

  let _sn: any = localStorage.getItem("set_name");
  let sn = JSON.parse(_sn);
  let setName = sn.name;
  let setId: string = sn.id; // Assuming set_id is stored

  useEffect(() => {
    const handleLoad = async () => {
      const userId = Id;
      console.log("Loading sets");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, setName: setName }),
      };
      try {
        console.log(requestOptions.body);
        const response = await fetch(
          "https://project.annetteisabrunette.xyz/api/viewset",
          requestOptions
        );
        const fetchedSet = await response.json();
        console.log(fetchedSet);

        if (!response.ok) {
          throw new Error("Failed to fetch sets");
        }
        console.log(fetchedSet.results.Flashcards);
        setStudySet(fetchedSet.results);
        console.log(fetchedSet.results.Flashcards);
        console.log("Fetched no errors");
      } catch (error) {
        console.error("Failed to load sets", error);
      }
    };

    if (Id && setName) {
      handleLoad();
    }
  }, [Id, setName]);

  interface Flashcard {
    id: string;
    term: string;
    definition: string;
  }

  interface StudySet {
    _id: string;
    SetName: string;
    Flashcards: Flashcard[];
    isEditingName: boolean;
  }

  const [studySet, setStudySet] = useState<StudySet>({
    _id: "",
    SetName: "",
    Flashcards: [],
    isEditingName: false,
  });
  const [isAddingFlashcard, setIsAddingFlashcard] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  const handleEditSetName = () => {
    setStudySet({ ...studySet, isEditingName: !studySet.isEditingName });
  };

  const handleSaveSetName = async (newName: string) => {
    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Id,
          setId: studySet._id,
          newName: newName,
        }),
      };

      const response = await fetch('https://project.annetteisabrunette.xyz/api/editsets', requestOptions);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error updating set name');
      }

      setStudySet({ ...studySet, name: newName, isEditingName: false });
    } catch (error) {
      console.error('Failed to save set name:', error);
    }
  };

  const handleDeleteSet = async () => {
    try {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Id,
          title: studySet.SetName,
        }),
      };

      const response = await fetch('https://project.annetteisabrunette.xyz/api/deleteset', requestOptions);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error deleting set');
      }

      // Redirect or update UI after deletion
      // Example:
      window.location.href = '/sets';
    } catch (error) {
      console.error('Failed to delete set:', error);
    }
  };

  const handleAddFlashcard = async () => {
    const newFlashcard: Flashcard = {
      id: Date.now().toString(),
      term,
      definition,
    };

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Id,
          setName: studySet.SetName,
          flashcard: newFlashcard,
        }),
      };

      const response = await fetch('https://project.annetteisabrunette.xyz/api/addflashcard', requestOptions);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Error adding flashcard');
      }

      const updatedSetResponse = await fetch(
        'https://project.annetteisabrunette.xyz/api/viewset',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: Id, setName: studySet.SetName }),
        }
      );

      const updatedSet = await updatedSetResponse.json();
      setStudySet(updatedSet.results);

      setTerm('');
      setDefinition('');
      setIsAddingFlashcard(false);
    } catch (error) {
      console.error('Failed to add flashcard:', error);
    }
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    try {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Id,
          setName: studySet.SetName,
          flashcardId: flashcardId,
        }),
      };

      const response = await fetch('https://project.annetteisabrunette.xyz/api/deleteflashcard', requestOptions);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error deleting flashcard');
      }

      setStudySet({
        ...studySet,
        Flashcards: studySet.Flashcards.filter(
          (flashcard) => flashcard.id !== flashcardId
        ),
      });
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
    }
  };

  const handleEditFlashcard = async (
    flashcardId: string,
    newTerm: string,
    newDefinition: string
  ) => {
    try {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Id,
          setName: studySet.SetName,
          flashcardId: flashcardId,
          newTerm: newTerm,
          newDefinition: newDefinition,
        }),
      };

      const response = await fetch('https://project.annetteisabrunette.xyz/api/editflashcard', requestOptions);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error editing flashcard');
      }

      setStudySet({
        ...studySet,
        Flashcards: studySet.Flashcards.map((flashcard) =>
          flashcard.id === flashcardId
            ? { ...flashcard, term: newTerm, definition: newDefinition }
            : flashcard
        ),
      });
    } catch (error) {
      console.error('Failed to edit flashcard:', error);
    }
  };

  return (
    <div>
      <PageTitle />
      <ViewStudySetUI
        studySet={studySet}
        isAddingFlashcard={isAddingFlashcard}
        setIsAddingFlashcard={setIsAddingFlashcard}
        term={term}
        setTerm={setTerm}
        definition={definition}
        setDefinition={setDefinition}
        isCardView={isCardView}
        setIsCardView={setIsCardView}
        handleDeleteSet={handleDeleteSet}
        handleEditSetName={handleEditSetName}
        handleSaveSetName={handleSaveSetName}
        handleAddFlashcard={handleAddFlashcard}
        handleDeleteFlashcard={handleDeleteFlashcard}
        handleEditFlashcard={handleEditFlashcard}
      />
    </div>
  );
};

export default ViewStudySetPage;
