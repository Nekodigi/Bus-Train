

import React from 'react';
import PathCard from '../components/pathCard';
import PathCards from '../components/pathCards';
import Head from "next/head";

export default function Home() {

  

  return (
    <div>
      <Head>
        <title>
          Bus-Train
        </title>
        <meta
          property="og:title"
          content="Bus-Train"
        />
        <meta
          property="og:description"
          content="バスの遅延に悩まされない！電車の乗り継ぎをもっと便利に！"
        />
        <meta property="og:image" content={"/Bus-Train.png"} />
        {/* "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" */}
      </Head>
      <PathCards></PathCards>
    </div>
    
  )
}
