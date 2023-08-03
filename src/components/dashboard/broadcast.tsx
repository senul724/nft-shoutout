export default function Broadcast(
  props: { collections: { address: string; collection_name: string | null }[] | null; callback: () => void },
) {
  const { collections, callback } = props;
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="grid grid-cols-2 gap-4 px-10 w-full">
        {collections && collections.length > 0
          ? (
            <>
              {collections.map((el, i) => (
                <Card
                  content={el.collection_name ? el.collection_name : el.address}
                  key={i}
                />
              ))}
            </>
          )
          : <Card content="No collections to receive messages" />}
      </div>
      <div
        className="p-4 mt-10 w-1/2 text-2xl font-bold text-center text-emerald-600 rounded-xl border border-emerald-600 shadow-lg hover:scale-105 bg-whte"
        onClick={callback}
      >
        register your collection to boradcast
      </div>
    </div>
  );
}

function Card(props: { content: string }) {
  const { content } = props;
  return (
    <div className="py-5 text-2xl font-semibold text-center text-gray-600 bg-white rounded-xl border shadow-lg hover:scale-105">
      {content}
    </div>
  );
}
