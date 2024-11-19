To escape the cross origin problems start http server with python*:
.\venv\Scripts\activate
python -m http.server 8000
Go to http://localhost:8000
Then open the d3js_BondGraph_Sample.html file by clicking it's name in browser **.

*Run CreateVenv.bat to create 'venv' folder with virtual environment (internet connection
is needed).

** JavaScript is cached by browsers. When changing JS, clear the cache for proper reload
once the page is updated. Or request in bworsers 'incognito mode'.