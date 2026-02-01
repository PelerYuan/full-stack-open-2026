const Header = (props) => {
    return (<div>
        <h3>{props.course}</h3>
    </div>);
};

const Part = (props) => {
    return (
        <p>
            {props.part} {props.exercises}
        </p>
    );
};

const Total = (props) => {
    return (<div>
        <b>total of exercises {props.num}</b>
    </div>);
};

const Content = (props) => {
    return (<div>
        {props.parts.map((part) => <Part key={part.id} part={part.name} exercises={part.exercises} />)}
    </div>);
};

const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total num={course.parts.reduce((sum, part) => sum + part.exercises, 0)}/>
        </div>
    )
}

export default Course