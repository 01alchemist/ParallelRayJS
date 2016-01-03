import {Camera} from "./Camera";
import {Scene} from "./Scene";

export class Tracer
{
	private m_camera:Camera;
	private m_scene:Scene;
	private m_workers:Array<Worker>;

	public Tracer()
	{
		m_camera = new Camera(new Vec3f(0.0f, 1.0f, 0.0f), 0.005f, 0.1f);
		m_scene = new Scene();
		m_workers = new ArrayList<Worker>();
		setWorkerAmount(Config.g_thread_amount);
	}

	public void setWorkerAmount(int n)
	{
		if (n <= 0)
			n = Runtime.getRuntime().availableProcessors();

		m_workers.clear();

		int width = Config.g_window_width;
		int height = Config.g_window_height;

		if (n > 1)
		{
			width /= n;
			height /= n;
			for (int j = 0; j < n; j++)
			{
				for (int i = 0; i < n; i++)
				{
					m_workers.add(new Worker(width, height, i * width, j * height, i + j * width, this));
				}
			}
		} else
		{
			m_workers.add(new Worker(width, height, 0, 0, 0, this));
		}
	}

	public void update(float dt)
	{
		m_scene.update(dt);
		m_camera.update(dt);
	}

	public void render(Display display)
	{
		if (workersFinished())
		{
			for (Worker w : m_workers)
			{
				w.setDisplay(display);
				Thread worker = new Thread(w, "Worker: " + w.getId());
				worker.start();
			}
		}
	}

	public Camera getCamera()
	{
		return m_camera;
	}

	public Scene getScene()
	{
		return m_scene;
	}

	public ArrayList<Worker> getWorkers()
	{
		return m_workers;
	}

	public boolean workersFinished()
	{
		for (Worker w : m_workers)
			if (!w.isFinished())
				return false;
		return true;
	}

}
