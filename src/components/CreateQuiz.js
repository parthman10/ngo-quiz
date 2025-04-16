import React, { useState, useRef } from 'react';
import '../styles/CreateQuiz.css';
import * as XLSX from 'xlsx';
// Import necessary components from react-beautiful-dnd if you choose it
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// Or import from react-dnd

// Placeholder for the DragDropQuiz component you will create
// import DragDropQuiz from './DragDropQuiz';

const CreateQuiz = ({ onNavigate }) => {
  // --- State for Excel Import ---
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('general');
  // Removed manual questions state: const [questions, setQuestions] = useState([...]);
  // Removed currentStep state: const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed manual error state: const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Removed previewMode state: const [previewMode, setPreviewMode] = useState(false);
  // Removed creationMode state: const [creationMode, setCreationMode] = useState('manual');
  // const [excelFile, setExcelFile] = useState(null); // Removed this line - unused variable
  const [excelFileName, setExcelFileName] = useState('');
  const [parsedExcelData, setParsedExcelData] = useState(null);
  const [excelError, setExcelError] = useState(''); // Keep Excel-specific error state
  const [isDragging, setIsDragging] = useState(false); // State for drag-over visual feedback

  // --- Categories and Difficulty (Keep if category is still used) ---
  const categories = [
    { id: 'general', name: 'General Knowledge' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'sports', name: 'Sports' },
    { id: 'custom', name: 'Custom' } // Keep custom if relevant for imported quizzes
  ];

  // Difficulty levels might not be needed for drag-and-drop, remove if unused
  // const difficultyLevels = [ ... ];

  // --- Remove useEffect hooks related to manual draft saving ---
  // useEffect(() => { ... load draft ... }, []);
  // useEffect(() => { ... save draft ... }, [quizTitle, quizCategory, questions]);

  // --- Remove functions related to manual question editing ---
  // const addQuestion = () => { ... };
  // const removeQuestion = (index) => { ... };
  // const updateQuestion = (index, field, value) => { ... };
  // const updateOption = (questionIndex, optionIndex, value) => { ... };
  // const addOption = (questionIndex) => { ... };
  // const removeOption = (questionIndex, optionIndex) => { ... };
  // const clearDraft = () => { ... };
  // const togglePreviewMode = () => { ... };

  // --- Function to Handle Excel File Input (Keep as is) ---
  // --- Ref for hidden file input ---
  const fileInputRef = useRef(null);

  // --- Remove the older, duplicate definition of handleExcelFileChange ---
  // This block should be removed or commented out if it still exists
  /*
  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setExcelFile(file);
      setExcelFileName(file.name);
      setExcelError('');
      setParsedExcelData(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // --- Excel parsing logic (Keep as is or refine) ---
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
             throw new Error("Excel file needs at least one header row and one data row.");
          }

          const draggableItems = [];
          const dropTargets = new Set();
          const correctMatches = {};

          for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              const draggableText = row[0]?.toString().trim();
              const targetText = row[1]?.toString().trim();

              if (draggableText && targetText) {
                  const itemId = `item-${i}`;
                  const targetId = `target-${targetText.toLowerCase().replace(/\s+/g, '-')}`;
                  draggableItems.push({ id: itemId, content: draggableText });
                  dropTargets.add(targetText);
                  correctMatches[itemId] = targetId;
              }
          }

          const dropTargetColumns = Array.from(dropTargets).map((label) => ({
              id: `target-${label.toLowerCase().replace(/\s+/g, '-')}`,
              title: label,
              itemIds: []
          }));

          const formattedQuizData = {
              items: draggableItems.reduce((acc, item) => { acc[item.id] = item; return acc; }, {}),
              columns: dropTargetColumns.reduce((acc, col) => { acc[col.id] = col; return acc; }, {}),
              sourceColumn: {
                  id: 'source-column',
                  title: 'Drag from here',
                  itemIds: draggableItems.map(item => item.id)
              },
              columnOrder: ['source-column', ...dropTargetColumns.map(col => col.id)],
              correctMatches: correctMatches
          };
          // --- End of parsing logic ---

          console.log('Parsed Excel Data for Drag-and-Drop:', formattedQuizData);
          setParsedExcelData(formattedQuizData);

        } catch (err) {
          console.error("Error parsing Excel file:", err);
          setExcelError(`Error parsing file: ${err.message}. Please ensure it's a valid Excel file with the correct format.`);
          setExcelFileName('');
          setExcelFile(null);
        }
      };
      reader.onerror = (err) => {
          console.error("FileReader error:", err);
          setExcelError('Error reading file.');
          setExcelFileName('');
          setExcelFile(null);
      }
      reader.readAsArrayBuffer(file);
    } else {
        setExcelFile(null);
        setExcelFileName('');
    }
  };
  */
  // --- End of block to remove ---


  // --- Function to Process the Excel File ---
  const processExcelFile = (file) => {
    if (!file) {
      setExcelError('No file provided.');
      // setExcelFile(null); // Comment already indicates removal
      setExcelFileName('');
      setParsedExcelData(null);
      return;
    }

    setExcelError(''); // Clear previous errors
    setParsedExcelData(null); // Reset parsed data while processing

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // --- Excel parsing logic ---
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Use { header: 1 } to get arrays of rows, skip first row (header) later
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) { // Need at least header + 1 data row
           throw new Error("Excel file needs at least one header row and one data row.");
        }

        const draggableItems = [];
        const dropTargets = new Set();
        const correctMatches = {};

        // Start from index 1 to skip the header row
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const draggableText = row[0]?.toString().trim();
            const targetText = row[1]?.toString().trim();

            if (draggableText && targetText) {
                const itemId = `item-${i}`;
                // Generate a consistent target ID based on the label text
                const targetId = `target-${targetText.toLowerCase().replace(/\s+/g, '-')}`;
                draggableItems.push({ id: itemId, content: draggableText });
                dropTargets.add(targetText); // Add the label text to the set
                correctMatches[itemId] = targetId;
            }
        }

        // Create columns based on unique target labels found
        const dropTargetColumns = Array.from(dropTargets).map((label) => ({
            id: `target-${label.toLowerCase().replace(/\s+/g, '-')}`, // Use the same ID generation logic
            title: label,
            itemIds: [] // Initially empty, items will be dragged here
        }));

        const formattedQuizData = {
            items: draggableItems.reduce((acc, item) => { acc[item.id] = item; return acc; }, {}),
            columns: dropTargetColumns.reduce((acc, col) => { acc[col.id] = col; return acc; }, {}),
            sourceColumn: {
                id: 'source-column',
                title: 'Drag from here',
                itemIds: draggableItems.map(item => item.id) // All items start here
            },
            // Ensure columnOrder includes source and all target columns
            columnOrder: ['source-column', ...dropTargetColumns.map(col => col.id)],
            correctMatches: correctMatches
        };
        // --- End of parsing logic ---

        console.log('Parsed Excel Data for Drag-and-Drop:', formattedQuizData);
        setParsedExcelData(formattedQuizData); // Set the parsed data state
        setExcelFileName(file.name); // Confirm file name after successful parse
        // setExcelFile(file); // Comment already indicates removal

      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setExcelError(`Error parsing file: ${err.message}. Please ensure it's a valid Excel file with the correct format.`);
        setExcelFileName('');
        // setExcelFile(null); // Comment already indicates removal
        setParsedExcelData(null); // Clear data on error
      }
    };
    reader.onerror = (err) => {
        console.error("FileReader error:", err);
        setExcelError('Error reading file.');
        setExcelFileName('');
        // setExcelFile(null); // Comment already indicates removal
        setParsedExcelData(null); // Clear data on error
    }
    reader.readAsArrayBuffer(file);
  };


  // --- Handler for the hidden file input ---
  // Keep this definition - it calls processExcelFile
  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Call processExcelFile, which now handles setting state like fileName and parsedData
      processExcelFile(file);
    }
    // Reset the input value to allow selecting the same file again if needed
    if (event.target) {
        event.target.value = null;
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Add a small delay or check relatedTarget to prevent flickering when dragging over child elements
     if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsDragging(false);
     }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      // Optional: Add check here if you only want to process .xlsx files dropped
      if (file.name.endsWith('.xlsx')) {
          processExcelFile(file); // Use the processing function
      } else {
          setExcelError('Invalid file type. Please drop an .xlsx file.');
          setExcelFileName('');
          // setExcelFile(null); // Comment already indicates removal
          setParsedExcelData(null);
      }
      event.dataTransfer.clearData(); // Clean up
    }
  };

  // --- Click Handler for Drop Zone Fallback ---
  const handleDropZoneClick = () => {
    // Trigger click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // --- Excel Submission Logic ---
  const handleSubmit = () => {
    console.log('Submitting:', isSubmitting);
    console.log('Parsed Excel Data:', parsedExcelData);

    // --- Excel Submission Logic ---
    if (!parsedExcelData) {
      setExcelError('Please upload and parse a valid Excel file first.');
      return;
    }
    if (!quizTitle.trim()) {
      setExcelError('Please enter a quiz title for the imported quiz.');
      return;
    }
    setExcelError('');
    setIsSubmitting(true);
    try {
      const quizzes = JSON.parse(localStorage.getItem('customQuizzes') || '[]');
      const newQuiz = {
        id: Date.now(),
        type: 'drag-and-drop', // Type is always drag-and-drop now
        title: quizTitle,
        category: quizCategory,
        quizData: parsedExcelData,
        createdAt: new Date().toISOString()
      };
      quizzes.push(newQuiz);
      localStorage.setItem('customQuizzes', JSON.stringify(quizzes));
      setSuccess('Drag-and-drop quiz created successfully from Excel!');
      console.log('Quiz created successfully!');
      setIsSubmitting(false);
      // Reset form state
      setParsedExcelData(null);
      // setExcelFile(null); // Comment already indicates removal
      setExcelFileName('');
      setQuizTitle('');
      setQuizCategory('general');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      console.error("Error saving Excel quiz:", err);
      setExcelError('Failed to save imported quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  // --- Simplified JSX ---
  return (
    <div className="create-quiz-container">
      {/* Removed Mode Selection Buttons */}
      {/* <div className="creation-mode-selector"> ... </div> */}

      {/* --- Always show Excel Import Section --- */}
      {/* Removed conditional rendering wrapper {creationMode === 'manual' ? ... : ...} */}
      <div className="excel-import-section"> {/* Can rename class or remove if not needed */}
         <h2 className="create-title">Import Drag & Drop Quiz from Excel</h2> {/* Updated title */}
        <p>Upload an .xlsx file. Expected format:</p>
        <ul>
          <li>Column A: Draggable Item Text</li>
          <li>Column B: Correct Drop Target Label</li>
          <li>(First row can be headers - they will be ignored)</li>
        </ul>

        {/* Add the button for downloading the template */}
        <button 
          onClick={generateAndDownloadTemplate}
          className="template-button"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download Template Excel File
        </button>

        {/* Show success/error messages */}
        {excelError && <div className="error-message">{excelError}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Title and Category inputs */}
         <div className="form-header">
           <div className="form-group">
             <label htmlFor="quiz-title-excel">Quiz Title</label>
             <input
               type="text"
               id="quiz-title-excel" // ID can be simplified to 'quiz-title'
               value={quizTitle}
               onChange={(e) => setQuizTitle(e.target.value)}
               placeholder="Enter a title for the imported quiz"
               className="form-control"
             />
           </div>
           <div className="form-group">
             <label htmlFor="quiz-category-excel">Category</label>
             <select
               id="quiz-category-excel" // ID can be simplified to 'quiz-category'
               value={quizCategory}
               onChange={(e) => setQuizCategory(e.target.value)}
               className="form-control"
             >
               {categories.map(category => (
                 <option key={category.id} value={category.id}>
                   {category.name}
                 </option>
               ))}
             </select>
           </div>
         </div>

        {/* Drag-and-Drop Zone */}
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
          style={{
            border: '2px dashed #ccc',
            padding: '40px', // Increased padding for larger area
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: '20px', // Increased margin for better spacing
            width: '80%', // Set width to make it larger
            margin: 'auto' // Center the drop zone
          }}
        >
          {excelFileName ? (
            <p>Selected: {excelFileName}</p> // Ensure file name is displayed
          ) : (
            <p>Drag and drop an .xlsx file here or click to select</p>
          )}
        </div>

        {/* Hidden file input for fallback */}
        <input
          type="file"
          id="excel-upload"
          accept=".xlsx"
          ref={fileInputRef}
          onChange={handleExcelFileChange}
          style={{ display: 'none' }}
        />

        {parsedExcelData && (
          <div className="excel-preview">
            <h4>Excel Data Parsed Successfully!</h4>
            <p>Items found: {Object.keys(parsedExcelData.items).length}</p>
            <p>Drop targets found: {Object.keys(parsedExcelData.columns).length}</p>
            <pre style={{ maxHeight: '200px', overflow: 'auto', background: '#eee', padding: '10px' }}>
              {JSON.stringify(parsedExcelData, null, 2)}
            </pre>
          </div>
        )}

        <div className="form-actions">
           <button
             className="cancel-button"
             onClick={() => onNavigate('start')} // Keep cancel functionality
           >
             Cancel
           </button>
          <button
            className="submit-button"
            onClick={handleSubmit} // Now only handles excel submission
            disabled={isSubmitting || !parsedExcelData} // Ensure conditions for enabling the button are met
          >
            {isSubmitting ? 'Saving...' : 'Create Quiz from Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;


// --- Function to Generate and Download Excel Template ---
const generateAndDownloadTemplate = () => {
  const data = [
    ['Draggable Item', 'Drop Target'],
    ['Earth', 'Planets'],
    ['Mars', 'Planets'],
    ['Jupiter', 'Planets'],
    ['Dog', 'Animals'],
    ['Cat', 'Animals'],
    ['Lion', 'Animals'],
    ['Red', 'Colors'],
    ['Blue', 'Colors'],
    ['Green', 'Colors']
  ];
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  
  XLSX.writeFile(wb, 'drag_drop_quiz_template.xlsx');};
