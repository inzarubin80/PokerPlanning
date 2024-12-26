package app

import (
	"encoding/base64"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"os"

	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/yandex"
)

type (

	//ProvidersUserData map[string]authinterface.ProviderUserData

	Options struct {
		Addr string
	}
	path struct {
		index, getPoker, createPoker, createTask,
		getTasks, getTask, updateTask, deleteTask,
		getComents, addComent, setVotingTask,
		getVotingControlState, ws, login, session, refreshToken, logOut, getProviders, ping, vote string
	}

	sectrets struct {
		storeSecret        string
		accessTokenSecret  string
		refreshTokenSecret string
	}

	config struct {
		addr      string
		path      path
		sectrets  sectrets
		provadersConf authinterface.MapProviderOauthConf
	}
)



func NewConfig(opts Options) config {

	imageDataYandexAuth, err := os.ReadFile("images/yandex-auth.png")
	if err != nil {
		fmt.Errorf(err.Error())
	}

	imageBase64 := base64.StdEncoding.EncodeToString(imageDataYandexAuth)

	provaders := make(authinterface.MapProviderOauthConf)
	provaders["yandex"] = &authinterface.ProviderOauthConf{	
		Oauth2Config: &oauth2.Config{
				ClientID:     os.Getenv("CLIENT_ID_YANDEX"),
				ClientSecret: os.Getenv("CLIENT_SECRET_YANDEX"),
				RedirectURL:  os.Getenv("APP_ROOT") + "/YandexAuthCallback",
				Scopes:       []string{"login:email", "login:info"},
				Endpoint:     yandex.Endpoint,
			},
			UrlUserData: "https://login.yandex.ru/info?format=json",
			ImageBase64: imageBase64,
	}



	config := config{
		addr: opts.Addr,
		path: path{

			index:       "",
			
			ping:  fmt.Sprintf("GET /api/ping"),
			createPoker:  "POST	/api/poker",
			getProviders: "GET /api/providers",
			login:        fmt.Sprintf("POST	/api/user/login"),
			refreshToken: fmt.Sprintf("POST	/api/user/refresh"),
			session:      fmt.Sprintf("GET	/api/user/session"),
			logOut:       fmt.Sprintf("GET	/api/user/logout"),
			createTask: fmt.Sprintf("POST /api/poker/{%s}/tasks", defenitions.ParamPokerID),
			
			vote: fmt.Sprintf("POST /api/poker/{%s}/vote", defenitions.ParamPokerID),
			
			setVotingTask: fmt.Sprintf("POST /api/poker/{%s}/voting-control/task/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			getVotingControlState: fmt.Sprintf("GET /api/poker/{%s}/voting-control", defenitions.ParamPokerID),
	
			getTasks:   fmt.Sprintf("GET /api/poker/{%s}/tasks", defenitions.ParamPokerID),
			getTask:    fmt.Sprintf("GET /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			updateTask: fmt.Sprintf("PUT /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			deleteTask: fmt.Sprintf("DELETE /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),

			getComents: fmt.Sprintf("GET /api/poker/{%s}/comments", defenitions.ParamPokerID),
			addComent:  fmt.Sprintf("POST /api/poker/{%s}/comments", defenitions.ParamPokerID),

			getPoker: fmt.Sprintf("GET /api/poker/{%s}", defenitions.ParamPokerID),
			ws:       fmt.Sprintf("GET /ws/{%s}", defenitions.ParamPokerID),


		},

		sectrets: sectrets{
			storeSecret:        os.Getenv("STORE_SECRET"),
			accessTokenSecret:  os.Getenv("ACCESS_TOKEN_SECRET"),
			refreshTokenSecret: os.Getenv("REFRESH_TOKEN_SECRET"),
		},

		provadersConf: provaders,
	}

	return config
}
