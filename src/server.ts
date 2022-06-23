import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, filterImageFromURL2, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  /**
   * 
   * Sam Wambua's Implementation of the @TODO1 above
   * 
   * 
  */
  app.get( "/filteredimage", async ( req, res ) => {

        const { image_url } = req.query;
        //get the image url from the query params
        //const image_url = req.query.image_url;
        if (!image_url) {
          return res.status(400).send('Bad Request. Please include the image url as a query parameter in your request (e.g. /filteredimage?image_url={{}})');
        }
        
        //call filterImageFromURL(image_url) to filter the image
        try{

            const filteredpath = await filterImageFromURL2(image_url);
            //send the resulting file in the response
            res.sendFile(filteredpath);
            //deletes any files on the server on finish of the response
            res.on('finish', () => {
              deleteLocalFiles([filteredpath]);
            });

        } catch(error){

            res.status(422).send("Error fetching image from: "+ image_url +". With error: "+ error);

        }

  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();