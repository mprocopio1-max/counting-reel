import { TopWord } from "../types/api";

interface TopWordsTableProps {
  words: TopWord[];
}

export function TopWordsTable({ words }: TopWordsTableProps): JSX.Element {
  return (
    <section className="panel">
      <h2>Top 20 Words</h2>
      {words.length === 0 ? (
        <p className="empty-state">No words available.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {words.map((item) => (
                <tr key={item.word}>
                  <td>{item.word}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
