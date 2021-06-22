import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        url: null,
        pause: true,
        volume: isNaN(localStorage.volume) ? 100 : parseInt(localStorage.volume),
        info: null
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
            if (state.info) {
                state.info.songId = state.info.commentId
            }
        },
        pauseChange(state) {
            if (state.url) {
                state.pause = !state.pause
            }
        },
        updateVolume(state, val) {
            state.volume = val
            Vue.$ipc.send('tray-control-volume', val)
        }
    },
    actions: {
        async play({commit}, {
            info,
            playlist = null
        }) {
            if (info.cp) {
                Vue.$message.warning('歌曲无法试听')
                return
            }
            if (playlist) {
                Vue.$store.commit('c_playlist/update', playlist)
            }
            commit('update', {
                info,
                pause: true
            })
            console.log(info)
            // 首先检查ip
            try {
                const {data} = await Vue.$clientApi('http://txt.go.sohu.com/ip/soip')
                const match = data.match(/sohu_IP_Loc_V="(.*?)"/)
                if (match && match[1].substr(0, 2) !== 'CN') {
                    console.log(match)
                    Vue.$message({
                        message: '当前ip来自海外,请检查是否使用了vpn,部分音乐可能无法播放',
                        duration: 5000,
                        type: 'warning'
                    })
                }
            } catch (e) {
                console.warn(e)
            }
            let data = await Vue.$musicApi.getSongUrl(info.vendor, info.commentId)
            if (data.status) {
                Vue.$store.dispatch('lyrics/init')
                let url = data.data.url
                if (url) {
                    url = url.startsWith('http') ? url : ('http://' + url)
                }
                commit('update', {
                    url,
                    pause: false
                })
            } else {
                console.log(data)
                Vue.$message.warning(data.msg)
            }
        }
    }
}
