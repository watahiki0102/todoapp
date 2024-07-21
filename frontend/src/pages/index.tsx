import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  createTheme,
  ThemeProvider,
  Typography,
  Paper,
  CssBaseline,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

// Todo型のインターフェース
interface Todo {
  id: number;
  title: string;
}

// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#03dac6",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

// コンポーネントの定義
const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");

  // コンポーネントのマウント時にfetchTodos関数を呼び出す
  useEffect(() => {
    fetchTodos();
  }, []);

  // サーバーからTodoリストを取得する
  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>(
        "http://localhost:8080/api/todos"
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // 新しいTodoを追加する
  const addTodo = async () => {
    try {
      const response = await axios.post<Todo>(
        "http://localhost:8080/api/todos",
        {
          title: newTodo,
        }
      );
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Todoのタイトルを更新する
  const updateTodo = async (id: number) => {
    try {
      const response = await axios.put<Todo>(
        `http://localhost:8080/api/todos/${id}`,
        {
          title: editTodoTitle,
        }
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditTodoId(null);
      setEditTodoTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Todoを削除する
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h1" align="center">
          Todoアプリ
        </Typography>
        <Paper elevation={3} style={{ padding: "1rem", marginBottom: "1rem" }}>
          {/* 新しいTodoを入力するテキスト */}
          <TextField
            label="New Todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          {/* Todoを追加するボタン */}
          <Button
            variant="contained"
            color="primary"
            onClick={addTodo}
            fullWidth
            style={{ marginBottom: "1rem" }}
          >
            Todo追加
          </Button>
        </Paper>
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              style={{
                backgroundColor: "#fff",
                marginBottom: "0.5rem",
                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
                borderRadius: "5px",
                padding: "0.5rem 1rem",
              }}
            >
              {/* 編集中のTodoかどうかを判定 */}
              {editTodoId === todo.id ? (
                <TextField
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                  onBlur={() => updateTodo(todo.id)}
                  fullWidth
                  variant="outlined"
                />
              ) : (
                <ListItemText
                  primary={todo.title}
                  onClick={() => {
                    setEditTodoId(todo.id);
                    setEditTodoTitle(todo.title);
                  }}
                />
              )}
              {/* Todoを削除するボタン */}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTodo(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
