type TopicListProps = {
    title: string;
    topics: string[];
};

function TopicList({
    title,
    topics,
}: TopicListProps){
    return (
        <div>
            <h3>{title}</h3>
            {topics.length === 0 ? (
                <p>None</p>
            ):(
                <ul>
                    {topics.map((topic) =>(
                        <li key={topic}>{topic}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TopicList;