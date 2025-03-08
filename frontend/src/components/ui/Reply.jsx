import React, { useState, useEffect } from 'react'
import { Button, Textarea, Text, Portal } from '@chakra-ui/react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger,} from "./dialog"
import { useUserStore } from '../../store/user';
import { useEventStore } from '../../store/event';
import { toaster } from "./toaster";
import { useDialogStore } from '../../store/dialog';


const Reply = ({event, isDialogOpen, setIsDialogOpen, commentState, setCommentState, target}) => {
  const user = useUserStore((state) => state.curr_user); // current user
  const openLogin = useDialogStore((state) => state.openLogin); // login prompt
  const {replyComment} = useEventStore(); // upload comment
  const promptMessage = "Post your comment"; // Message displayed in comment prompt
  const [userComment, setUserComment] = useState(""); // store user's current comment

  useEffect(() => {
    
  }, [])

  const handlePost = async () => {
      // if user login then upload comment
      if (user) {
          // if user didn't upload empty comment
          if (userComment !== "") {
              const {success, message} = await replyComment(event._id, user._id, userComment, target);

              // if failing upload comment 
              if (!success) {
                  toaster.create({
                      title: "Error",
                      description: message,
                      type: "error",
                      duration: 1500,
                      isCloseable: true
                  });
              } else { // reset input
                  setUserComment("");
                  setCommentState(!commentState);
                  setIsDialogOpen(false)
                  return;
              }
          } else { // if empty comment, do nothing
              setIsDialogOpen(false)
              return;
          }
      } else { // Other wise pop login prompt
          openLogin();
      }
      
  };

  return (
    <Portal>
      <DialogRoot placement={"center"} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Text
                fontSize={"xl"}
                fontWeight={"bold"}
                bgClip={"text"}
                textAlign={"left"}
                color={"black"}
                whiteSpace={"pre-line"}
                alignSelf={"flex-start"}
              >
                Reply
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Textarea
                value={userComment}
                onChange={
                    (text) => setUserComment(text.target.value)
                }
                w={"full"}
                rows={10}
                resize={"none"}
                placeholder={promptMessage}
                _placeholder={{ 
                    color: "gray.500",
                    fontSize: 20,
                }}
                color={"black"}
                border={"transparent"}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              style={{ 
                  border: 'black', 
                  background: 'black', 
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: 'white',
                  alignSelf: 'end'
                  }}
              onClick={() => setIsDialogOpen(false)}
              rounded={"lg"}
            >
              Cancle
            </Button>
            <Button
              style={{ 
                  border: 'black', 
                  background: 'black', 
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: 'white',
                  alignSelf: 'end'
                  }}
              onClick={handlePost}
              rounded={"lg"}
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Portal>
  );
}
  
export default Reply;