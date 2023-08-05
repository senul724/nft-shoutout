import type { ReactElement } from "react";
import { Dash } from "~/components/layout/dash";
import type { NextPageWithLayout } from "~/pages/_app";
import { prisma } from "~/server/db";

interface IPayload {
  messages: { id: string; content: string }[];
}

const UserDash: NextPageWithLayout<IPayload> = (props) => {
  return <p>{JSON.stringify(props.messages)}</p>;
};

export async function getStaticPaths() {
  const collections = await prisma.collection.findMany({
    select: {
      address: true,
    },
  });

  const paths = collections.map((el) => ({
    params: { collection: el.address },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(props: { params: { collection: string } }) {
  const { params } = props;
  const messages = await prisma.collection.findUnique({
    where: {
      address: params.collection,
    },
    select: {
      messages: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  let payload: IPayload = { messages: [] };
  if (messages) {
    payload = { messages: messages.messages };
  }

  return {
    props: payload,
    revalidate: 60,
  };
}

UserDash.getLayout = function getLayout(page: ReactElement) {
  return (
    <Dash>
      {page}
    </Dash>
  );
};

export default UserDash;
