const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    );
};

const Part = (props) => {
    return (
        <div>
            <p>
                {props.part} {props.exercises}
            </p>
        </div>
    );
};

const Total = (props) => {
    return (
        <div>
            <p>Number of exercises {props.num}</p>
        </div>
    );
};

const Content = (props) => {
    return (
        <div>
            {
                props.parts.map((part) =>
                    <Part part={part.name} exercises={part.exercises}/>
                )
            }
        </div>
    );
};

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total num={course.parts.reduce((sum, part) => sum + part.exercises, 0)}/>
        </div>
    );
};

export default App;
