#!/usr/bin/env python

'''
 **************************************************************************
 * This class provides an http server that waits for JSON formatted orders
 * to operate on graphs, and returns answers unders JSON format too.
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 **************************************************************************
'''

import tornado.ioloop
import tornado.web
import cgi
import json
import sys
import os
import mimetypes

print sys.path
# this should point to your tulip directory
#libtulip_dir = "/work/tulip-dev/tulip_3_8-build/release/install/lib/python"
#sys.path.append(libtulip_dir)
#libtulip_dir = "/work/svn/renoust/workspace/tulip_3_6_maint-build/release/install/lib"
#sys.path.append(libtulip_dir)
#libtulip_dir = "/work/github/TulipPosy/tulip-server"
#sys.path.append(libtulip_dir)

from tulip import *

# custom python scripts for graph and query analysis, might be released soon
#lgtPython_dir = "/home/brenoust/Dropbox/OTMedia/lighterPython" 
#sys.path.append(lgtPython_dir)
#lgtPython_dir = "/home/brenoust/Dropbox/MultiClientDev/tulip-server" 
#sys.path.append(lgtPython_dir)

#import searchQuery

from graphManager import *
from session import *

import mds

globalSessionMan = TPSession()
'''
This class handles all the requests given through POST queries
GET queries are also managed but basically do nothing
We might in the future use a different webserver such as 'tornado'
!!!!!! GOT to undersand if one instance of requestHandler is created at each reception?!

'''
class MyRequestHandler(tornado.web.RequestHandler):

    def initialize(self, path):
        print "initialising:", path
        self.sessionMan = globalSessionMan
        #self.sessionMan.start()
        self.utilGraphMan = graphManager()
        newPath = path.split("/")
        newPath[len(newPath)-1] = "client"
        self.currentPath = "/".join(newPath)+"/"
        print "current path=",self.currentPath
    # the graph manager instance allows many pure graph manipulation
    #graphMan = graphManager()
    

    def getGraphMan(self, data):
        #print "SESSION MANAGER: ", self.sessionMan.sidList

        if 'sid' in data.keys():
            sid = data['sid'][0]
            if self.sessionMan.is_registered(sid):
                return self.sessionMan.get_session(sid)
            else:
                print "SID INVALID OR EXPIRED"
        else:
            print "NO SID PASSED"
        return None

    def createNewSession(self):
        return self.sessionMan.create_session()

    '''
    This method handles a GET request but doesn't do anything with it
    (it used to create a random graph of n nodes, n argument of the get query)
    '''
    @tornado.web.asynchronous
    def get(self, arg):
        print ">>>>>>>>>>>>> GET RECIEVED <<<<<<<<<<<<<<<<<<<<<<", arg
        fileList = os.listdir(self.currentPath)
        #print fileList
        #print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> recieved get!!!" 
        print "the request: ", self.request.uri
        uri = self.request.uri.split("/")[1]
        args = uri.split("?")
        print 'args:',args
        print "parse:",cgi.parse_qs(uri)
        
        
        if os.path.isfile(self.currentPath+arg):
            print "FILE found!", self.currentPath+arg
            abspath = os.path.abspath(self.currentPath)
            mime_type, encoding = mimetypes.guess_type(self.currentPath+arg)
            
            f = open(self.currentPath+arg, 'r')
            self.set_header("Content-type", mime_type)
            self.write(f.read())#.encode('utf-8'))
            f.close()
            self.finish()
        
        isArg = [True for a in args if a != ""]
        if uri == "" and not isArg:
            self.render(self.currentPath+"index.html")
                
        '''
        if uri in fileList:
            f = open(self.currentPath+uri, 'r')
            self.write(f.read())#.encode('utf-8')))
            f.close()
            self.finish()
        '''
        
        '''
        print cgi.parse_qs(self.request)
        
        #ctype, pdict = cgi.parse_header(self.request.headers.get('content-type'))
        print ctype
        print pdict
        
        print "before it messes up <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
        
        if len(self.path.split('?'))<2:
            return
        paramStr = self.path.split('?')[1]
        if len(paramStr) == 1:
            return
        params = {}
        
        returnJSON = ""

        if len(paramStr) > 1:
                params = cgi.parse_qs(paramStr, True, True)
                print "this section should deliver probably the JS of the API"
                print paramStr
                if "n" in params.keys():
                        print params["n"][0]
                        try:
                                print "doing silly things with n"
                                #self.getGraphMan(request).createGraph(int(params["n"][0]))
                                #returnJSON = self.getGraphMan(request).graphToJSON()
                                #print "this is to return: ",returnJSON

                        except:
                                print "wrong parameter n"
                else:
                    print "parameter n should be set to integer: ?n=XX"
                
                print "GET parameters: ",params

        self.sendJSON(returnJSON)
        '''

    '''
    This method handles post queries. The POST content should be a well formatted JSON
    file containing instructions or a file to upload to the server.
    '''
    def post(self,arg):
        print ">>>>>>>>>>>>>>>>>>>>> POST ARG:",arg
        #print "SESSION MANAGER: ", self.sessionMan.sidList, self.sessionMan
        #print "These are the headers: ",self.headers
        ctype, pdict = cgi.parse_header(self.request.headers.get('content-type'))
        #print ctype
        #print pdict

        # handles a graph manipulation request
        if ctype == 'application/x-www-form-urlencoded':
                length = int(self.request.headers.get('content-length'))
                #print "pure reception :", self.request.body
                postvars = cgi.parse_qs(self.request.body, keep_blank_values=1)
                #print postvars.keys()
                graphJSON = ""
                self.handleRequest(postvars)


        # handles a file upload
        if ctype == 'application/octet-stream':
                
                length = int(self.request.headers.get('content-length'))
                f = ""
                try :
                        fStr = self.request.body
                        f = json.loads(fStr)
                        #print "gonna print the file:"
                        #print fStr
                        #print "gonna print the dict:"
                        #print json.dumps(f)
                except:
                        print 'cannot read input file'

                self.handleFileUpload(json.dumps(f))

                #length = int(self.headers.getheader('content-length'))
                #postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)



    '''
    Forks any type of graph manipulation request to the right handler
    request, the JSON object of the request
    '''
    def handleRequest(self, request):
        #print "The request:",request
        if 'type' in request.keys():
                if request['type'][0] == 'creation':
                        self.creationRequest(request)

                if request['type'][0] == 'analyse':
                        self.analysisRequest(request)

                if request['type'][0] == 'algorithm':
                        #print 'algo requested'
                        self.algorithmRequest(request)

                if request['type'][0] == 'update':
                        self.updateGraphRequest(request)
                        
                if request['type'][0] == 'plugin':
                        self.getPlugins(request)


    '''
    Returns a json as a list.
    The list contains all the different algorithms supported by tulip
    or the parameters necessary to configure a specific plugin.
    Warning, some of these functions are not functionning well
    in earlier versions of Tulip. Works fine from Tulip 4.0
    '''
    def getPlugins(self, request):
        
        returnParams = {}
        
        print "getting pleugins"
        print request
        
        params = request['parameters'][0]
        params = json.loads(params)
        if not 'type' in params:
            return
        
        if params['type'] == 'layout':
            returnParams = json.dumps(tlp.getLayoutAlgorithmPluginsList())
        if params['type'] == 'double':
            returnParams = json.dumps(tlp.getDoubleAlgorithmPluginsList())
        if params['type'] == 'boolean':
            returnParams = json.dumps(tlp.getBooleanAlgorithmPluginsList())
        if params['type'] == 'string':
            returnParams = json.dumps(tlp.getStringAlgorithmPluginsList())
        if params['type'] == 'integer':
            returnParams = json.dumps(tlp.getIntegerAlgorithmPluginsList())
        if params['type'] == 'size':
            returnParams = json.dumps(tlp.getSizeAlgorithmPluginsList())
        if params['type'] == 'color':
            returnParams = json.dumps(tlp.getColorAlgorithmPluginsList())
        if params['type'] == 'algorithm':
            returnParams = json.dumps(tlp.getAlgorithmPluginsList())
        
        if params['type'] == 'pluginParameter':
            if 'pluginName' in params:
                #TODO manage with preset graphs
                returnParams = json.dumps(tlp.getDefaultPluginParameters(pluginName))
            
        print returnParams
        
        self.sendJSON(returnParams)



    '''
    For now, a file upload just resend it to the d3 interface as it is, which will treat it.
    We might want to do some file check before anything.
    jsonFile, the file that has been uploaded
    '''
    def handleFileUpload(self, jsonFile):
        self.set_status(200)
        self.set_header("Content-type", "application/json")
        #self.end_headers()
        #print "this is the original json to return: ",jsonFile
        self.write(jsonFile)#.encode('utf-8'))
        self.finish()
                

    '''
    Sends a json string to the d3 interface.
    jsonF, the JSON formatted answer to send.
    '''    
    def sendJSON(self, jsonF):
        #self.send_response(200)
        #self.send_header("Content-type", "application/json")
        #self.end_headers()
        #print "Sending back the JSON : ",jsonF
        #self.wfile.write(jsonF)
        self.set_status(200)
        self.set_header("Content-type", "application/json")
        #self.end_headers()
        #print "this is the original json to return: ",jsonFile
        self.write(jsonF)#.encode('utf-8'))
        self.finish()


    '''
    Handles an algorithm request, gathers the parameters and calls the algorithm process and send back the updated graph.
    request, the JSON object of the request
    '''        
    def algorithmRequest(self, request):
        if 'parameters' in request.keys():
                params = request['parameters'][0]
                params = json.loads(params)
                print 'parameters:', params, ' type:', params['type']
                if 'type' in params and 'name' in params:
                        if params['type'] == 'layout':
                                layoutName = params['name'].encode("utf-8")
                                g = None
                                if layoutName == 'MDS':
                                        print "calling mds layout"
                                        g = self.getGraphMan(request).substrate
                                        descP = g.getStringProperty("descriptors")
                                        #res = mds.MDS(g, descP).points()
                                        res = mds.MDS(g, descP).sklearn_mds()
                                        print res                        
                                else:
                                    g = self.getGraphMan(request).callLayoutAlgorithm(layoutName, params['target'].encode("utf-8"))
                                if g:
                                    graphJSON = self.getGraphMan(request).graphToJSON(g, {'nodes':[{'type':'string', 'name':'label'}]})
                                    self.sendJSON(graphJSON)

                        if params['type'] == 'float':
                                g = self.getGraphMan(request).callDoubleAlgorithm(params['name'].encode("utf-8"), params['target'].encode("utf-8"))
                                graphJSON = self.getGraphMan(request).graphToJSON(g, {'nodes':[{'type':'float', 'name':'viewMetric'}, {'type':'string', 'name':'label'}]})                                        
                                self.sendJSON(graphJSON)

                        if params['type'] == 'synchronize layouts':
                                print "calling layout sync"
                                graphJSON = self.getGraphMan(request).synchronizeLayouts()
                                self.sendJSON(graphJSON)

    '''
    Handles an induced subgraph request, gathers the parameters and calls the process and send back the updated graph.
    request, the JSON object of the request
    '''
    def updateGraphRequest(self, request):
        if 'parameters' in request.keys():
                params = request['parameters'][0]
                params = json.loads(params)

                if 'type' in params:
                    if params['type'] == 'induced':
                        #print "update request: ",request
                        graphSelection = json.loads(request['graph'][0]) 
                        g = self.getGraphMan(request).inducedSubGraph(graphSelection, request['target'][0])
                        #g = self.getGraphMan(request).modifyGraph(g)
                        #print 'recieved this list: ',graphSelection
                        graphJSON = self.getGraphMan(request).graphToJSON(g,{'nodes':[{'type':'string', 'name':'label'}]})
                        #graphJSON = self.getGraphMan(request).graphToJSON(g)
                        #print 'sending this list: ',graphJSON
                        self.sendJSON(graphJSON)
                    if params['type'] == 'layout':
                        
                        graphSelection = json.loads(params['graph'])
                        self.getGraphMan(request).updateLayout(graphSelection, params['target'])
                        #update the layout here from the target graph
                        #shouldn't we check the sid beforehand?


    '''
    Handles a graph creation request. 'search' for a SE query, 'graph' for a tulip graph creation.
    request, the JSON object of the request
    '''
    def creationRequest(self, request):
        # handles a search request, gathers the result and formats the graph in order to send to d3
        if 'search' in request.keys():
                #print 'search is in request: ',request
                query = request['search'][0]
                g = searchQuery.main(query)

                baseIDP = g.getDoubleProperty('baseID')
                idP = g.getDoubleProperty('id')
                label = g.getStringProperty('label')
                vLabel = g.getStringProperty('viewLabel')

                for n in g.getNodes():
                        baseIDP[n] = n.id
                        idP[n] = n.id
                        label[n] = vLabel[n]

                        
                for e in g.getEdges():
                        baseIDP[e] = e.id
                        idP[e] = e.id

                graphJSON = self.utilGraphMan.graphToJSON(g,{'nodes':[{'type':'string', 'name':'label'}, {'type':'float', 'name':'id'}], 'edges':[{'type':'float', 'name':'id'}, {'type':'string', 'name':'descripteurs'}]})
                self.sendJSON(graphJSON)

        # creates in tulip a graph sent by d3 (and randomizes its layout just for the show), sends it back
        if 'graph' in request.keys():
                #print postvars['graph'][0]
                graphJSON = json.loads(request['graph'][0])
                sidMap = {'sid':[self.createNewSession()]}
                g = self.getGraphMan(sidMap).addGraph(graphJSON)
                self.getGraphMan(sidMap).substrate = g
                #g = self.getGraphMan(sidMap).randomizeGraph(g)
                #graphJSON = self.getGraphMan(sidMap).graphToJSON(g, {'data':{'sid':sidMap['sid'][0]}, 'nodes':[{'type':'string', 'name':'label'}]})
                nodeProps = self.grabProperties(graphJSON['nodes'])
                linkProps = self.grabProperties(graphJSON['links'])
                #print "############################### node props"
                #print nodeProps
                #print "############################### link props"
                #print linkProps
                params = {'data':{'sid':sidMap['sid'][0]}, 'nodes':nodeProps, 'links':linkProps}
                #print "############################### all parameters"
                #print params

                #graphJSON = self.getGraphMan(sidMap).graphToJSON(g, {'data':{'sid':sidMap['sid'][0]}, 'nodes':[{'type':'string', 'name':'label'}]})
                #graphJSON = self.getGraphMan(sidMap).graphToJSON(g, {'data':{'sid':sidMap['sid'][0]}, 'nodes':nodeProps, 'links':linkProps})
                graphJSON = self.getGraphMan(sidMap).graphToJSON(g, params)

                #print "####################################### SENDING THIS GRAPH"
                print graphJSON
                #print "##########################################################"
                #print "Sending SID right here: ", sidMap
                self.sendJSON(graphJSON)

    def grabProperties(self, arr):
            #print "The given array:"               
            #print arr
            pairs = set()
            for n in arr:
                    #print "a node: ", n.keys()
                    for k in n.keys():
                        if k != "baseID" and k != "source" and k != "target":
                            #print "a key: ", k, " its element: ",n[k]
                            prop = 0
                            kType = type(n[k])
                            if kType == int or kType == float:
                                    prop = "float"
                            if kType == str:
                                    prop = "string"
                            if kType == bool:
                                    prop = "bool"
                            if kType == unicode:
                                    prop = "string"
                            #print "should add a pair now: "
                            #print ';'.join([k, prop])
                            pairs.add(';'.join([prop, k]))
            pairs.add("string;viewLabel")
            #print "right before returning"
            return [{'type': p.split(';')[0].encode('utf-8'), 'name': p.split(';')[1].encode('utf-8')} for p in pairs]               
            #return [{'type': p.split(';')[0], 'name': p.split(';')[1]} for p in pairs]               
                                    

    '''
    Handles an analysis of the graph that generates the second graph that is sent to d3.
    Analysis and synchronizations are quite the same, so the parameters will tell the difference.
    The target should be given in the JSON request parameters.
    A synchronization from a substrate selection, will pass a selection of the graph as argument.
    request, the JSON object of the request
    '''
    def analysisRequest(self, request):
        selection = 0
        result = 0
        weightProperty = ""
        operator = "OR"

        print 'the analysis request : ',request

        # get the selection
        if 'graph' in request:
                selection = json.loads(request['graph'][0])
        if 'weight' in request:
                weightProperty = request['weight'][0]
        if 'operator' in request:
                operator = request['operator'][0]

        # request the analysis for the given substrate selection 
        if request['target'][0] == 'substrate':
                print "the weight property: ",weightProperty
        print "graphMan: ",self.getGraphMan(request)
        print "request: ",request
        result = self.getGraphMan(request).analyseGraph(selection, weightProperty)
        graphJSON = self.getGraphMan(request).graphToJSON(result[0], {'nodes':[{'type':'float', 'name':'weight'}, {'type':'string', 'name':'label'}, {'type':'float', 'name':'entanglementIndex'},{'type':'float', 'name':'frequency'}],'links':[{'type':'string', 'name':'conditionalFrequency'}, {'type':'float', 'name':'weight'}], 'data':{'entanglement intensity':result[1], 'entanglement homogeneity':result[2]}})
        #print "Analysis return: "                                        

        # request the synchronization for the given catalyst selection
        if request['target'][0] == 'catalyst':
                graphJSON = self.getGraphMan(request).synchronizeFromCatalyst(selection, operator)
         
        # send back the resulting graph
        self.sendJSON(graphJSON)


'''
The main function launches the HTTP server on a given address and port until it recieves the interruption ^C signal.
'''
'''
def main():
        try:
                server_address = '0.0.0.0'
                server_port = 8085 
                Handler = MyRequestHandler
                server = SocketServer.TCPServer((server_address, server_port), Handler)
                #server = HTTPServer(('', int(port)), MainHandler)
                print 'started httpserver...'
                server.serve_forever()
        except KeyboardInterrupt:
                print '^C received, shutting down server'
                server.socket.close()
'''

# This initializes some tulip variables we need and loads the basic plugins
tlp.initTulipLib()
tlp.loadPlugins()
#main()


#class MyApplication(tornado.web.Application):
#    def __init__(self, *params):
#        tornado.web.Application.__init__(self, *params)
        

root = os.path.dirname(__file__)
#print "ROOT="
#print os.path.dirname(os.getcwd()+'/../d3/')
#+"../d3/")
#root = "/work/PDP/TulipPosy/d3/"



'''
application = MyApplication([
    (r"/", MyRequestHandler),
    ], static_path=root
)
'''

#class MainHandler(tornado.web.RequestHandler):
#    def get(self):
#        self.render("../d3/index.html")


application = tornado.web.Application([
    #(r"/(.*\.html)", tornado.web.StaticFileHandler, {"path": "/work/PDP/TulipPosy/d3/)"}),
    #(r"/(.*\.js)", tornado.web.StaticFileHandler, {"path": "/work/PDP/TulipPosy/d3/)"}),
    #(r"/(.*\.js)", tornado.web.StaticFileHandler, {"path": "/work/PDP/TulipPosy/d3/)"})
    #])
    #(r'/(.*)', tornado.web.StaticFileHandler, {'path': "/work/PDP/TulipPosy/d3/)"}),
    (r"/(.*)", MyRequestHandler, {'path': os.getcwd()})
    ])
    #], template_path=root,
    #static_path=root)

if __name__ == "__main__":
    application.listen(31497)
    tornado.ioloop.IOLoop.instance().start()




