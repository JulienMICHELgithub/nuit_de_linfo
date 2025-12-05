import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Message from './Message';

type DialogBoxProps = {
    message: string;
    characterName?: string;
    onDone: () => void;
};

const useStyles = makeStyles(() => ({
    dialogWindow: ({ screenWidth, screenHeight }: { screenWidth: number; screenHeight: number }) => {
        const messageBoxHeight = Math.ceil(screenHeight / 3.5);

        return {
            imageRendering: 'pixelated',
            textTransform: 'uppercase',
            backgroundColor: '#e2b27e',
            border: 'solid',
            borderWidth: '12px',
            padding: '16px',
            position: 'absolute',
            top: `${Math.ceil(screenHeight - (messageBoxHeight + messageBoxHeight * 0.1))}px`,
            width: `${Math.ceil(screenWidth * 0.8)}px`,
            left: '50%',
            transform: 'translate(-50%, 0%)',
            minHeight: `${messageBoxHeight}px`,
        };
    },
    dialogTitle: {
        fontSize: '16px',
        marginBottom: '12px',
        fontWeight: 'bold',
    },
    dialogFooter: {
        fontSize: '16px',
        cursor: 'pointer',
        textAlign: 'end',
        position: 'absolute',
        right: '12px',
        bottom: '12px',
    },
}));

const DialogBox = ({ message, characterName = '', onDone }: DialogBoxProps) => {
    const [viewport, setViewport] = useState(() => {
        if (typeof window === 'undefined') {
            return { screenWidth: 800, screenHeight: 600 };
        }
        return { screenWidth: window.innerWidth, screenHeight: window.innerHeight };
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const updateViewport = () => {
            setViewport({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
        };
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    const classes = useStyles(viewport);
    const [messageEnded, setMessageEnded] = useState(false);
    const [forceShowFullMessage, setForceShowFullMessage] = useState(false);

    const handleAdvance = useCallback(() => {
        if (messageEnded) {
            setMessageEnded(false);
            setForceShowFullMessage(false);
            onDone();
        } else {
            setMessageEnded(true);
            setForceShowFullMessage(true);
        }
    }, [messageEnded, onDone]);

    useEffect(() => {
        const handleKeyPressed = (e: KeyboardEvent) => {
            if (['Enter', 'Space', 'Escape'].includes(e.code)) {
                handleAdvance();
            }
        };

        window.addEventListener('keydown', handleKeyPressed);
        return () => window.removeEventListener('keydown', handleKeyPressed);
    }, [handleAdvance]);

    return (
        <div className={classes.dialogWindow}>
            {characterName && (
                <div className={classes.dialogTitle}>{characterName}</div>
            )}
            <Message
                message={message}
                forceShowFullMessage={forceShowFullMessage}
                onMessageEnded={() => setMessageEnded(true)}
            />
            <div onClick={handleAdvance} className={classes.dialogFooter}>
                {messageEnded ? 'Ok' : 'Next'}
            </div>
        </div>
    );
};

export default DialogBox;