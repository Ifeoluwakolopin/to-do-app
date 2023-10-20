import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import HomePage from "./pages/HomePage";



const mockData = [
  {
    id: 1,
    title: "To Do",
    items: [
      {
        id: "task1",
        content: "Buy groceries",
        children: []
      },
      {
        id: "task2",
        content: "Walk the dog",
        children: []
      }
    ]
  },
  {
    id: 2,
    title: "In Progress",
    items: [
      {
        id: "task3",
        content: "Learning React",
        children: []
      }
    ]
  },
  {
    id: 3,
    title: "Done",
    items: [
      {
        id: "task4",
        content: "Complete Homework",
        children: [
          {
            id: "task3",
            content: "Learning React",
            children: []
          },
          {
            id: "task3",
            content: "Learning React",
            children: []
          }
        ]
      }
    ]
  }
];


export default function App() {
  return (
    <BrowserRouter>
      <Container fluid className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage lists={mockData} />} />
          {/* You can add more routes as needed here */}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}