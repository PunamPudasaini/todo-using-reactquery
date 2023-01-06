import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../api/todosApi';

function TodoList() {
    const [newTodo, setNewTodo] = useState('');
    const queryClient = useQueryClient();

    const { isLoading, error, isError, data: todos } = useQuery('todos', getTodos, {
        select: data => data.sort((a, b) => b.id - a.id)
    });

    const addTodoMutation = useMutation(addTodo, {
        //invalidates cache & refetch
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })

    const updateTodoMutation = useMutation(updateTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })

    const deleteTodoMutation = useMutation(deleteTodo, {
        onSuccess: () => {
            queryClient.invalidateQueries("todos")
        }
    })


    const handleSave = (e) => {
        e.preventDefault();

        addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false })
        setNewTodo("")
    }

    const newItemselection = (
        <form onSubmit={handleSave}>
            <label>Enter new Todo Items</label>
            <div>
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="enter new todo"></input>
            </div>
            <button>
                Save
            </button>
        </form>
    )

    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isError) {
        content = <p>{error.message}</p>
    } else {
        content = todos.map((todo) => {
            return (
                <>
                    <article key={todo.id}>
                        <div>
                            <input type="checkbox" checked={todo.completed} id={todo.id} onChange={() => {
                                updateTodoMutation.mutate({ ...todo, completed: !todo.completed })
                            }}></input>
                            <label>{todo.title}</label>
                        </div>
                        <button onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>Delete</button>

                    </article>
                </>
            )
        })
    }

    return (
        <main>
            <h1>Todo List</h1>
            {newItemselection}
            {content}
        </main>
    );
}

export default TodoList;
