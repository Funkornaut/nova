## Goals: 
- [ ] Create an AI Agent swarn that produces generative art and posts it.
- [ ] Create a rodeo.club action in the CDP SDK or Agent Kit. -- maybe start here?? from hackathon: AgentKit Pool Prize ⸺ $3,000 (split evenly to all qualifying projects), Best Agent Kit Contributions - create pr (1st, 2ed, 3ed)

- [ ] Agent swarm has ability to post to farcaster.
- [ ] Agent swarm has ability to post to twitter.

## Agent Design
Using Coinbase Agent Kit and OpenAI Swarm we will create a multiagent system where each agent is responsible for a different part of the process. 

1. Inspo Agent. 
- should use onchain data for inspiration and data/randomness for the generative script
- should determine the number of pieces in the collection ranging between 1 and 420.
2. Artist Agent. 
- needs to be able to generate a script in python for the art collection
- needs to take the inspriation and data passed from the inspriation agent when creating the script
- should create some sort of randomness from the onchain data it is given
3. Image Agent. 
- needs to be able to upload image to ipfs
- need to save that ipfs hash so it can be used to create the tokens metadata on rodeo.club 
4. Rodeo Agent. 
- this agent needs a script that will follow the instructions for posting to rodeo.club
- this agent needs a script that will follow the instructions for posting to rodeo.club
- Instruction on how to programatically post on rodeo.club can be found here: https://withfoundation.notion.site/Programmatic-posting-on-Rodeo-16942ca5b9e180ad9a76c1aa1b76e042 or /PostToRodeo.md
5. Farcaster Agent. 
- needs to be able to post to farcaster
- should be able to create a frame for minting the tokens on rodeo.club for farcaster
- should properly shill the art
- should be able to interact with other farcaster accounts


## Website design
A simple landing page with a short desctiption of the bot and a compentent that will allow users to chat with the bot and see the art and purchase the art.

We can use this current repo as a starting point for the website and IPFS uploads. Maybe the bot "lives" here and we can see it in action. People can come to this website and see the art being generated. 

