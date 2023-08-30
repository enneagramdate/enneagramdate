import React from 'react';
import Matches from './Matches'

const MatchList = () =>{

    return (
        <div className = " flex flex-col h-screen items-center justify-between">
            <div className = "rounded-xl h-4/5 w-6/12 bg-secondary flex flex-col items-center content-center">
                <Matches />
                <Matches />
                <Matches />
                <Matches />
                <Matches />
            </div>
            {/* <nav className="w-screen h-10/12">
                <ul className = "flex bg-secondary w-6/12 justify-center content-center mx-auto h-12/12">
                    <li className= "bg-primary"><a href="">Profile</a></li>
                    <li className="bg-primary ml-20"><a href="">Recs</a></li>
                    <li className="bg-primary ml-20"><a href="">Matches</a></li>
                </ul>
            </nav> */}
        </div>
    );
}

export default MatchList;