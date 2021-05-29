import React from 'react';
import { Button } from '@material-ui/core';
import styles from './Home.module.scss';


export default function Home() {

    return(
        <div className={styles.Home}>
            <Button color="primary">Hello World</Button>
        </div>
    )

}