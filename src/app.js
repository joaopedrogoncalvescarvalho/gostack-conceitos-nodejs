const express = require("express");
const cors = require("cors");

const uuid = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

const existRepository = (request, response, next) => {
  const indexRepository = repositories.findIndex(repository => repository.id === request.params.id);

  if(indexRepository < 0)
    return response.status(400).json({ message: 'Repository not found'});

  request.params.indexRepository = indexRepository;

  return next();
}

const uniqueCertify = (request, response, next) => {
  const generaty_id = uuid.uuid();

  const indexRepository = repositories.findIndex(repository => repository.id === generaty_id);

  if(indexRepository < 0)
  {
    request.body.id = generaty_id;

    return next();
  }

  uniqueCertify(request, request, next);
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", uniqueCertify, (request, response) => {
  const { title, url, techs, id } = request.body;

  const data = {
    id,
    title, 
    url,
    techs,
    likes: 0
  };

  repositories.push(data);

  return response.json(data);
});

app.put("/repositories/:id", existRepository, (request, response) => {
  const { title, url, techs, likes } = request.body;
  const { indexRepository } = request.params;

  const data = {
    id: request.params.id,
    title,
    url,
    techs,
    likes: repositories[indexRepository].likes
  };

  repositories[indexRepository] = data;

  return response.json(data);
});

app.delete("/repositories/:id", existRepository, (request, response) => {
  repositories = repositories.filter(repository => repository.id != request.params.id);

  return response.status(204).json({ message: "Repository deleted" });
});

app.post("/repositories/:id/like", existRepository, (request, response) => {
  const { indexRepository } = request.params;

  repositories[indexRepository].likes += 1;

  return response.json({ likes: repositories[indexRepository].likes });
});

module.exports = app;
