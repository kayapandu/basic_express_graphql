const express = require('express');
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allTodoList = [
    {
        id: 1571667990080,
        title: 'Brush tooth',
        content: 'Brushing',
        isFinished: false
    },
    {
        id: 1571668001042,
        title: 'Clean bathroom',
        content: 'Cleaning',
        isFinished: false
    },
    {
        id: 1571668008735,
        title: 'Clean furniture',
        content: 'Cleaning',
        isFinished: false
    },
];

let todoList = allTodoList;

const resetTodoList = () => {
    todoList = allTodoList;
}

// Reset Todolist every 30 minute
setInterval(resetTodoList, 1800000);

// Rest API
const getTodo = (req, res) => {
    return res.send(todoList);
};

const addTodo = (req, res) => {
    todoList = [
        ...todoList,
        {
            id: Date.now(),
            title: req.body.title,
            content: req.body.title,
            isFinished: false
        }
    ];
    return res.send('Data added successfully');
};

const updateTodo = (req, res) => {
    const todoId = req.params.id;
    const todoIndex = todoList.findIndex((todoList) => todoList.id == todoId);
    
    todoList[todoIndex] = {
        ...todoList[todoIndex],
        isFinished: !todoList[todoIndex].isFinished
    };

    return res.send('Data updated successfully');
};

const deleteTodo = (req, res) => {
    const todoId = req.params.id;
    const todoIndex = todoList.findIndex((todoList) => todoList.id == todoId);
    todoList.splice(todoIndex, 1);
    return res.send('Data deleted successfully');
}

app.get('/', getTodo);
app.post('/', addTodo);
app.put('/:id', updateTodo);
app.delete('/:id', deleteTodo);

/* GraphQL */
// Schema
var schema = buildSchema(`
    type Query {
        getAllTodoList: [Todo]
    },
    type Mutation {
        createTodo(title: String!, content: String!): Todo,
        updateTodo(id: Float!): Todo,
        deleteTodo(id: Float!): [Todo]
    },
    type Todo {
        id: Float,
        title: String!,
        content: String!,
        isFinished: Boolean!
    }
`);

const getTodoGql = () => {
    return todoList;
}

const createTodoGql = ({title, content}) => {
    const newTodo = {
        id: Date.now(),
        title,
        content,
        isFinished: false
    }
    todoList = [
        ...todoList,
        newTodo
    ];

    return newTodo;
}

const updateTodoGql = ({id}) => {
    const todoIndex = todoList.findIndex(todo => todo.id == id);
    todoList[todoIndex] = {
        ...todoList[todoIndex],
        isFinished: !todoList[todoIndex].isFinished
    };

    return todoList[todoIndex];
}

const deleteTodoGql = ({id}) => {
    const todoIndex = todoList.findIndex(todo => todo.id == id);
    todoList.splice(todoIndex, 1);

    return todoList;
}

// Resolver
var root = {
    getAllTodoList: getTodoGql,
    createTodo: createTodoGql,
    updateTodo: updateTodoGql,
    deleteTodo: deleteTodoGql
};


app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


app.listen(process.env.PORT || 8080, () => console.log('App is running'));

