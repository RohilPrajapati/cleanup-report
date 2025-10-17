## Getting Started

For detailed instructions on setting up and running the Django backend, see the Backend README:

[Backend Setup & Instructions](backend/README.md)

This includes:

- Django project setup
- Virtual environment / pip installation
- Periodic tasks and Celery setup
- Running the Django development server 


---

## 📝 TODO

- frontend implementation
- authentication
- notification
- testing
- celery result  (is not working need to check)

---


---
## Screen Shot
### cleanup executed task list
![report list](./screenshot/report_list.png)

### Manual Trigger response which queue task for cleanup
![trigger response](./screenshot/trigger_response.png)

### console log of task being executed
![console task being executed](./screenshot/console_for%20task%20being%20executed.png)


---

### Run Project using Docker Compose
Run all the container
```bash
docker-compose up --build
```
- ```up```: Starts all services defined in docker-compose.yml.
- ```--build```: Forces rebuilding images before starting containers.
- Add ```-d``` if you want to run containers in detached/background mode

Once started, your app will be available at:
http://localhost:80

Run all the container
```bash
docker-compose down
```
Stops all running containers.

Removes containers, networks, and default volumes created by docker-compose up.

If you want to also remove images and named volumes, you can use:
```bash
docker-compose down --rmi all -v
```

