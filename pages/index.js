import { uuid } from "uuidv4"

export default function Index(){

  return

}

export async function getServerSideProps(){

  return{
    redirect: {
      permanent: true,
      destination: `/${uuid()}`,
    },
  }

}