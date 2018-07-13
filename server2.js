var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

var { coursesData } = require('./mocks');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        genre: String
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    type Genre {
      id: Int,
      title: String
    }
`);

const getCourse = (args) => {
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = (args) => {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const root = {
    course: getCourse,
    courses: getCourses,
    genre: () => 'Some genre!'
};

const HTTP_PORT = 4000;

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(HTTP_PORT, () => console.log('Express GraphQL Server Now Running On localhost:' +  HTTP_PORT + '/graphql'));
