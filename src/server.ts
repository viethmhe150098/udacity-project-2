import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: any, res: any) => {
    const image_url: string = (typeof req.query.image_url === 'string') ? req.query.image_url : "";
    // 1. validate the image_url query
    if(!image_url) {
      res.status(400).send("Image's URL can not be empty");
      return;
    }

    
    try{
      // 2. call filterImageFromURL(image_url) to filter the image
      const imagePath: string = await filterImageFromURL(image_url);
      // 3. send the resulting file in the response
      res.sendFile(imagePath, (err:Error) => {
        if(err){
          res.status(500).send("Internal Server error");
          return;
        }
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([imagePath]);
      })
    } catch(err) {
      console.log(err);
      res.status(400).send("Image's URL can not be empty");
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();